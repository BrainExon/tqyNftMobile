class Image {
  imageId: string;
  name: string;
  date: string;
  owner: string;
  url: string;
  constructor(
    imageId: string,
    name: string,
    date: string,
    owner: string,
    url: string,
  ) {
    this.imageId = imageId;
    this.name = name;
    this.date = date;
    this.owner = owner;
    this.url = url;
  }
}

export default Image;
