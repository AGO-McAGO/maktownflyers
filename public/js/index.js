"use strict";


const navButton = document.querySelector(".navbutton"); // grabs the burger button.
const nav = document.querySelector("nav"); // grabs the nav element.

// toggle navigation button
navButton.addEventListener( "click", () => {
    navButton.classList.toggle("open");
    nav.classList.toggle("open");
} );
//! navigation end

// photo lightbox view
const maktownPhotos = document.querySelectorAll(" .mediaimg figure img");
const lightbox = document.createElement("div"); lightbox.id = "lightbox"; // create div and assign "lightbox" class.
document.body.appendChild(lightbox); // insert lightbox into webpage.

// open/add lightbox, to display photo
maktownPhotos.forEach( maktownPhoto => {

  maktownPhoto.addEventListener( "click", e => {
    lightbox.classList.add("active"); // add the lightbox
    const lightboxImg = document.createElement("img"); // create image element
    lightboxImg.src = maktownPhoto.src; // set the source of the img element created to be the source of the image in the webpage that's clicked on
    while (lightbox.firstChild) {lightbox.removeChild(lightbox.firstChild)}; // remove img in the lightbox if any; ensures only one img at a time in the lightbox
    lightbox.appendChild(lightboxImg); // add the img clicked on to the lightbox.
  } );

} );

// close/remove lightbox
lightbox.addEventListener( "click", e => {

  if (e.target == e.currentTarget) {
    lightbox.classList.remove("active");
  }

} );
//! photo lightbox end