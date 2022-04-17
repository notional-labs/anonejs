import { create, urlSource } from "ipfs-http-client";

const ipfs = create("https://ipfs.infura.io:5001");
const IPFS_PREFIX = "ipfs://";

export const upload = async (uploadPath) => {
  const file = await ipfs.add(urlSource(uploadPath));
  return file;
};

export const ipfsUpload = async (image) => {
  const uploadResult = await upload(image)
  const uploadResultPath = IPFS_PREFIX + String(uploadResult.cid)
  return uploadResultPath
}
