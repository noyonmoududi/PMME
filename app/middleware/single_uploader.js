

function single_uploader(path) {
  let uploader = loadLibrary('fileuploader');
  return (req, res, next) => {
      const upload = uploader(
        "",
        ["application/vnd.ms-excel","text/csv","application/msword","application/pdf","image/jpeg", "image/jpg", "image/png","application/zip","video/mp4","video/MP2T"],
        process.env.maxUploadFileSize,
        "Only .jpg, jpeg,.png,pdf,zip,mp4,csv,msword or excle format allowed!",
        `./public/file_storage/${path}/`
      );

      // call the middleware function
      upload.any()(req, res, (err) => {
        if (err) {
          req.session.flash_toastr_error = err.message;
          //return res.redirect(`${req.originalUrl}`);
          return back(req,res);
        } else {
          next();
        }
      });
    }
}

module.exports = single_uploader;
