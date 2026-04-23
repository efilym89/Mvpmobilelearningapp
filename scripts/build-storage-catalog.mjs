import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const STORAGE_DIR = path.join(ROOT_DIR, "storage");
const OUTPUT_FILE = path.join(STORAGE_DIR, "catalog.generated.json");

const courseBlueprints = {
  "day-1": {
    id: "day-1",
    title: "День 1. Бренд, мастер и клиентский путь",
    description:
      "Первый день программы знакомит с брендом Annaelle, ролью мастера, ожиданиями клиента и базовой логикой сервиса на каждом этапе пути.",
    color: "rose",
    isMandatory: true,
    isRecommended: false,
    deadline: null,
  },
  "day-2": {
    id: "day-2",
    title: "День 2. Продажи, ценность и доведение до сделки",
    description:
      "Второй день посвящен продажам: от подготовки к контакту и выявления потребностей до презентации продукта, цены, возражений и завершения сделки.",
    color: "green",
    isMandatory: true,
    isRecommended: false,
    deadline: null,
  },
};

const videoExtensions = [".mp4", ".m4v", ".mov", ".webm", ".mkv"];
const coverExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"];

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findFirstFile(directoryPath, candidates) {
  return candidates.find((candidate) => fs.existsSync(path.join(directoryPath, candidate))) ?? null;
}

function findFirstByExtension(directoryPath, basename, extensions) {
  for (const extension of extensions) {
    const candidate = `${basename}${extension}`;
    if (fs.existsSync(path.join(directoryPath, candidate))) {
      return candidate;
    }
  }

  return null;
}

function listDirectoryNames(directoryPath) {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en", { numeric: true }));
}

function buildLessonEntry(dayFolder, lessonFolder) {
  const lessonDirectory = path.join(STORAGE_DIR, dayFolder, lessonFolder);
  const metadataPath = path.join(lessonDirectory, "metadata.json");
  const metadata = fs.existsSync(metadataPath) ? readJson(metadataPath) : {};
  const primaryVideo = findFirstByExtension(lessonDirectory, "video", videoExtensions);
  const coverFile =
    findFirstFile(lessonDirectory, ["cover.jpg", "cover.jpeg", "cover.png", "cover.webp", "cover.svg", "cover.avif"]) ??
    findFirstByExtension(lessonDirectory, "cover", coverExtensions);
  const presentationPdf = findFirstFile(lessonDirectory, ["presentation.pdf"]);
  const presentationPptx = findFirstFile(lessonDirectory, ["presentation.pptx"]);
  const order = Number(lessonFolder.replace("lesson-", ""));
  const day = Number(dayFolder.replace("day-", ""));
  const lessonId = `${dayFolder}-${lessonFolder}`;
  const hasVideoSequence = Array.isArray(metadata.videoSequence) && metadata.videoSequence.length > 0;

  const videoSequence = hasVideoSequence
    ? metadata.videoSequence.map((videoPart, index) => ({
        id: `${lessonId}-video-${index + 1}`,
        title: videoPart.title ?? `Видео ${index + 1}`,
        file: videoPart.file,
        durationLabel: videoPart.durationLabel ?? null,
        videoDurationSeconds: videoPart.videoDurationSeconds ?? null,
        completionThreshold: videoPart.completionThreshold ?? 1,
        url: `/storage/${toPosixPath(path.join(dayFolder, lessonFolder, videoPart.file))}`,
      }))
    : [];

  const resolvedPrimaryVideoUrl = videoSequence[0]?.url ?? (primaryVideo ? `/storage/${toPosixPath(path.join(dayFolder, lessonFolder, primaryVideo))}` : null);

  return {
    id: lessonId,
    day,
    order,
    title: metadata.title ?? `Урок ${order}`,
    status: metadata.status ?? "published",
    durationLabel: metadata.durationLabel ?? "",
    videoDurationSeconds: metadata.videoDurationSeconds ?? null,
    description: metadata.description ?? null,
    shortDescription: metadata.shortDescription ?? null,
    fullDescription: metadata.fullDescription ?? null,
    speakerName: metadata.speakerName ?? null,
    placeholderNote: metadata.placeholderNote ?? null,
    objectives: Array.isArray(metadata.objectives) ? metadata.objectives : [],
    coverAlt: metadata.coverAlt ?? null,
    videoUrl: resolvedPrimaryVideoUrl,
    presentationPdfUrl: presentationPdf ? `/storage/${toPosixPath(path.join(dayFolder, lessonFolder, presentationPdf))}` : null,
    presentationPptxUrl: presentationPptx ? `/storage/${toPosixPath(path.join(dayFolder, lessonFolder, presentationPptx))}` : null,
    coverUrl: coverFile ? `/storage/${toPosixPath(path.join(dayFolder, lessonFolder, coverFile))}` : null,
    videoSequence,
  };
}

function buildCourseEntry(dayFolder) {
  const blueprint = courseBlueprints[dayFolder];

  if (!blueprint) {
    throw new Error(`No course blueprint configured for ${dayFolder}`);
  }

  const lessons = listDirectoryNames(path.join(STORAGE_DIR, dayFolder)).map((lessonFolder) =>
    buildLessonEntry(dayFolder, lessonFolder),
  );

  return {
    ...blueprint,
    lessons,
  };
}

if (!fs.existsSync(STORAGE_DIR)) {
  throw new Error("storage directory was not found");
}

const catalog = {
  generatedAt: new Date().toISOString(),
  courses: listDirectoryNames(STORAGE_DIR)
    .filter((name) => /^day-\d+$/i.test(name))
    .map((dayFolder) => buildCourseEntry(dayFolder)),
};

fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Storage catalog generated: ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
