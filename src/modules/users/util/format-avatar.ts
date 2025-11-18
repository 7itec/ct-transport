export default (uri: string) => {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  return formData;
};
