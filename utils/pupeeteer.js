const pdf = require("html-pdf");
const opt = {
  phantomPath: path.resolve(
    process.cwd(),
    "node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"
  ),
};

const getStream = async (html, options) => {
  return new Promise((resolve, reject) => {
    pdf.create(html, { ...opt, ...options }).toStream((err, stream) => {
      if (err) {
        reject(err);
      } else {
        resolve(stream);
      }
    });
  });
};

module.exports = { getStream };
