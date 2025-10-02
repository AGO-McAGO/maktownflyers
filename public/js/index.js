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

const stripe = Stripe("pk_test_51SD8w7CNFb0D13sPTH0zvLnJeF3nL08I5xUeXR9W8l2XSHs8kLCVzAYqv6SWRvUWTNx1v0sOOmlTnaxscR4664bu00tg2otqbZ");
const donateButton = document.getElementById("donatebutton");
const donationForm = document.getElementById("donationform");
const errorMessage = document.getElementById("errormessage");

donationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const donationamount = document.getElementById("donationamount").value;
  
  try {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ donationamount: parseFloat(donationamount) }),
    } );
    
    const session = await response.json();
    
    if (session.error) {
      errorMessage.textContent = session.error;
    } else {
      const result = await stripe.redirectToCheckout({ sessionId: session.id, });
      
      if (result.error) {
        errorMessage.textContent = result.error.message;
      }
    }

  } catch (error) {
    console.error("Error:", error);
    errorMessage.textContent = "An unexpected error occurred.";
  }

} );
//! stripe validation form end