
const htmlOuter = inner => `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang xml:lang>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <title>Photo Album</title>
  <style>
    code{white-space: pre-wrap;}
    span.smallcaps{font-variant: small-caps;}
    span.underline{text-decoration: underline;}
    div.column{display: inline-block; vertical-align: top; width: 50%;}
    div.hanging-indent{margin-left: 1.5em; text-indent: -1.5em;}
    ul.task-list{list-style: none;}
    .display.math{display: block; text-align: center; margin: 0.5rem auto;}
  ${albumStyle}
  </style>
</head>
<body>
<div id='preview'>
${inner}
</div>
<dialog id="modal"></dialog>
<script>
${downloadImage.toString()}
${focusImage.toString()}
</script>
</body>
</html>
`;

let images = [];

function download() {
  const elHtml = preview.innerHTML;
  const link = document.createElement('a');
  const mimeType = 'text/plain';
  link.download = `${(new Date()).toISOString()}-photobook.html`;
  const blob = new Blob([htmlOuter(elHtml)], {type: mimeType});
  link.href = URL.createObjectURL(blob);
  link.click();
//  URL.revokeObjectURL(link.href);
}

function downloadImage(index) {
  const imageNodes = document.getElementsByClassName('image-preview');
  const image = imageNodes[index];
  const link = document.createElement('a');
  link.download = image.name;
  link.href = image.src;
  link.click();
}

function focusImage(index) {
  const imageNodes = document.getElementsByClassName('image-preview');
  const image = imageNodes[index];
  modal.innerHTML='';
  modal.appendChild(image.cloneNode());
  modal.onclick= () => {modal.open=false};
  modal.open = true;
}

function addimages() {
  const files = image.files;
  for (let i = 0; i < files.length; i++) {
      addimage(files[i]);
  }
  image.files = [];
}

const previewPrelude = '<h1></h1>'

const albumStyle = `
#modal {
  border: none;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  position: fixed;
  top: 0;
}
.image-outer-box {
  margin: 1.666666%;
  width: 30%;
  float: left;
}
.image-inner-box {
  cursor: pointer;
  width: 100%;
  position: relative;
  padding-top: 100%;
  background: black;
}
.image-preview {
    max-height : 100%;
    max-width : 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translateY(-50%) translateX(-50%);
    transform: translateY(-50%) translateX(-50%);
}
.image-inner-box button {
  z-index: 1000;
  position: relative;
}
`;

function reset() {
  images = [];
  renderImages();
}

function renderImages() {
  preview.innerHTML = '';
  images.forEach((x, i) => {
//    const deleteButton = document.createElement('button');

    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Save Image';
    downloadButton.setAttribute('onclick', `downloadImage(${i})`);

    x.className = 'image-preview';

    const imageInnerBox = document.createElement('div');
    imageInnerBox.className = 'image-inner-box';
    const imageOuterBox = document.createElement('div');
    imageOuterBox.className = 'image-outer-box';
    imageOuterBox.setAttribute('onclick', `focusImage(${i})`);
    imageOuterBox.appendChild(imageInnerBox);
    imageInnerBox.appendChild(x);
    imageInnerBox.appendChild(downloadButton);
    preview.appendChild(imageOuterBox);
  });
}

function addimage(file) {
  const img = new Image;
  const fr = new FileReader;
  fr.onload = () => {img.src = fr.result; img.name = file.name};
  fr.readAsDataURL(file);
  img.onload = () => {
    images.push(img);
    renderImages();
  }
}

const styleSheet = document.createElement('style');
styleSheet.innerText = albumStyle;
document.head.appendChild(styleSheet);
