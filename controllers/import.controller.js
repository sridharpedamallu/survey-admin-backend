const multer = require("multer");
const re = /(?:\.([^.]+))?$/;

const targetList = [
  {
    id: 1,
    target: "Topics",
  },
  {
    id: 2,
    target: "Subtopics",
  },
  {
    id: 3,
    target: "Questions",
  },
];

const renameFile = (file) => {
  return `${getFileName(file)}_${Date.now()}.${getExtension(file)}`
    .toString()
    .toLowerCase();
};

const checkFileType = (file, cb) => {
  const filetypes = /csv|xls/;
  const extname = filetypes.test(getExtension(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Invalid file!");
  }
};

const getFileName = (fileName) => {
  return fileName.replace(re.exec(fileName)[0], "");
};

const getExtension = (fileName) => {
  return re.exec(fileName)[1];
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imports");
  },
  filename: function (req, file, cb) {
    cb(null, renameFile(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).single("importFile");

exports.uploadFileHandler = (request, response) => {
  upload(request, response, function (err) {
    if (err) {
      response.status(500).send(err);
    } else {
      response.send("Uploaded");
    }
  });
};
