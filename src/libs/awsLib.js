import { Storage } from "aws-amplify";

export default async function s3Upload(file, level) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.put(filename, file, {
    contentType: file.type,
    level: level || "private"
  });
  return stored.key;
}
