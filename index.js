require("dotenv").config();
const fetch = require("node-fetch");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const WPAPI = require("wpapi");
const wp = new WPAPI({
  endpoint: process.env.ENDPOINT,
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
});

let exclude = process.env.DATE;
function checkThumbnails() {
  let url = `${process.env.CHECKURL + process.env.MODE + exclude}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 1; i < data.length; i++) {
        if (!data[i]._embedded["wp:featuredmedia"]) {
          return console.log("work done");
        } else {
          if (!UrlExists(data[i]._embedded["wp:featuredmedia"][0].source_url)) {
            // if (
            //   !UrlExists(
            //     data[i]._embedded["wp:featuredmedia"][0].media_details.sizes
            //       .wpscript_thumb_admin.source_url,
            //   )
            // ) {
            wp.posts()
              .id(data[i].id)
              .delete()
              .then((data) => {
                console.log("remove id= " + data.id);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            exclude = data[i].date;
            console.log("ok " + data[i].id);
            // console.log(
            //   data[i]._embedded["wp:featuredmedia"][0].media_details.sizes
            //     .wpscript_thumb_admin.source_url,
            // );
          }
        }
      }
      checkThumbnails();
    });
}

function UrlExists(url) {
  let http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  if (http.status !== 404) return true;
  else return false;
}

checkThumbnails();
