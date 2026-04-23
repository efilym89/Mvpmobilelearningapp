import http from "node:http";
import {
  authenticateUser,
  completeLessonForUser,
  getAdminOverview,
  getCourseForUser,
  getLessonForUser,
  getTestForUser,
  listCoursesForUser,
  resolveUserFromToken,
  submitTestForUser,
} from "./preview-data.mjs";

const port = Number(process.env.PORT ?? 4100);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  response.end(JSON.stringify(payload));
}

function notFound(response) {
  sendJson(response, 404, { message: "Resource not found" });
}

function unauthorized(response) {
  sendJson(response, 401, { message: "Unauthorized" });
}

function extractToken(request) {
  const authorization = request.headers.authorization ?? "";
  return authorization.startsWith("Bearer ")
    ? authorization.replace("Bearer ", "")
    : null;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
    });

    request.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  if (!request.url || !request.method) {
    notFound(response);
    return;
  }

  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;

  try {
    if (request.method === "GET" && pathname === "/api/health") {
      sendJson(response, 200, {
        status: "ok",
        service: "annaelle-preview-api",
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/auth/login") {
      const body = await readBody(request);
      const session = authenticateUser(body.email, body.password);

      if (!session) {
        sendJson(response, 401, { message: "Invalid email or password" });
        return;
      }

      sendJson(response, 200, session);
      return;
    }

    const user = resolveUserFromToken(extractToken(request));

    if (!user) {
      unauthorized(response);
      return;
    }

    if (request.method === "GET" && pathname === "/api/courses") {
      sendJson(response, 200, listCoursesForUser(user.id));
      return;
    }

    const lessonMatch = pathname.match(/^\/api\/courses\/([^/]+)\/lessons\/([^/]+)$/);
    if (request.method === "GET" && lessonMatch) {
      const [, courseId, lessonId] = lessonMatch;
      const lesson = getLessonForUser(user.id, courseId, lessonId);

      if (!lesson) {
        notFound(response);
        return;
      }

      sendJson(response, 200, lesson);
      return;
    }

    const lessonCompleteMatch = pathname.match(/^\/api\/courses\/([^/]+)\/lessons\/([^/]+)\/complete$/);
    if (request.method === "POST" && lessonCompleteMatch) {
      const [, courseId, lessonId] = lessonCompleteMatch;
      const ok = completeLessonForUser(user.id, courseId, lessonId);

      if (!ok) {
        notFound(response);
        return;
      }

      sendJson(response, 200, { ok: true });
      return;
    }

    const testMatch = pathname.match(/^\/api\/courses\/([^/]+)\/test$/);
    if (request.method === "GET" && testMatch) {
      const [, courseId] = testMatch;
      const test = getTestForUser(courseId);

      if (!test) {
        notFound(response);
        return;
      }

      sendJson(response, 200, test);
      return;
    }

    const testSubmitMatch = pathname.match(/^\/api\/courses\/([^/]+)\/test\/submit$/);
    if (request.method === "POST" && testSubmitMatch) {
      const [, courseId] = testSubmitMatch;
      const body = await readBody(request);
      const result = submitTestForUser(user.id, courseId, body.answers ?? []);

      if (!result) {
        notFound(response);
        return;
      }

      sendJson(response, 200, result);
      return;
    }

    const courseMatch = pathname.match(/^\/api\/courses\/([^/]+)$/);
    if (request.method === "GET" && courseMatch) {
      const [, courseId] = courseMatch;
      const course = getCourseForUser(user.id, courseId);

      if (!course) {
        notFound(response);
        return;
      }

      sendJson(response, 200, course);
      return;
    }

    if (request.method === "GET" && pathname === "/api/admin/overview") {
      if (user.role !== "admin") {
        unauthorized(response);
        return;
      }

      sendJson(response, 200, getAdminOverview());
      return;
    }

    notFound(response);
  } catch (error) {
    sendJson(response, 500, {
      message: error instanceof Error ? error.message : "Unexpected server error",
    });
  }
});

server.listen(port, () => {
  console.log(`Annaelle preview API listening on http://localhost:${port}/api`);
});
