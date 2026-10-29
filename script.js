/* ==========================================
   HAMID KHAN WEDS SANIYA KHAN
   Invitation Website Functions
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  const doorScreen = document.getElementById("doorScreen");
  const videoScreen = document.getElementById("videoScreen");
  const tapButton = document.getElementById("tapButton");
  const entranceVideo = document.getElementById("entranceVideo");
  const vintageCard = document.getElementById("vintageCard");
  const replayButton = document.getElementById("replayButton");

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));

  const previousSlide = document.getElementById("previousSlide");
  const nextSlide = document.getElementById("nextSlide");
  const calendarButton = document.getElementById("calendarButton");

  let currentSlide = 0;
  let touchStartX = 0;
  let touchStartY = 0;


  /* ==========================================
     1. TAP THE DOOR AND PLAY VIDEO WITH MUSIC
  ========================================== */

  tapButton.addEventListener("click", async function () {

    doorScreen.hidden = true;
    videoScreen.hidden = false;

    // Keep audio enabled so the video's original music plays.
    entranceVideo.muted = false;
    entranceVideo.volume = 1;
    entranceVideo.playsInline = true;

    try {

      entranceVideo.currentTime = 0;
      await entranceVideo.play();

    } catch (error) {

      console.error("Entrance video could not play:", error);

      // The invitation remains accessible even if the video fails.
      showInvitation();

    }

  });


  /* ==========================================
     2. SHOW CARD WHEN VIDEO ENDS
  ========================================== */

  function showInvitation() {

    vintageCard.hidden = false;
    replayButton.hidden = false;

    showSlide(0);

  }

  entranceVideo.addEventListener("ended", function () {

    /*
      Do not hide the video.
      It remains on its final frame behind the card.
    */

    showInvitation();

  });


  /* ==========================================
     3. VIDEO ERROR FALLBACK
  ========================================== */

  entranceVideo.addEventListener("error", function () {

    console.error(
      "Please check that entrance.webm exists in the repository root."
    );

    showInvitation();

  });


  /* ==========================================
     4. REPLAY THE ENTRANCE VIDEO
  ========================================== */

  replayButton.addEventListener("click", async function () {

    vintageCard.hidden = true;
    replayButton.hidden = true;

    try {

      entranceVideo.currentTime = 0;
      entranceVideo.muted = false;
      await entranceVideo.play();

    } catch (error) {

      showInvitation();

    }

  });


  /* ==========================================
     5. FOUR-SLIDE NAVIGATION
  ========================================== */

  function showSlide(index) {

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {

      slide.classList.toggle("active", i === currentSlide);

      slide.setAttribute(
        "aria-hidden",
        i === currentSlide ? "false" : "true"
      );

    });

    dots.forEach(function (dot, i) {

      dot.classList.toggle("active", i === currentSlide);

      dot.setAttribute(
        "aria-current",
        i === currentSlide ? "true" : "false"
      );

    });

  }


  previousSlide.addEventListener("click", function () {

    showSlide(currentSlide - 1);

  });


  nextSlide.addEventListener("click", function () {

    showSlide(currentSlide + 1);

  });


  dots.forEach(function (dot) {

    dot.addEventListener("click", function () {

      showSlide(Number(dot.dataset.go));

    });

  });


  /* ==========================================
     6. MOBILE SWIPE LEFT AND RIGHT
  ========================================== */

  vintageCard.addEventListener("touchstart", function (event) {

    if (!event.changedTouches.length) return;

    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;

  }, { passive: true });


  vintageCard.addEventListener("touchend", function (event) {

    if (!event.changedTouches.length) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const differenceX = endX - touchStartX;
    const differenceY = endY - touchStartY;

    // Ignore vertical scrolling; respond to horizontal swipes only.
    if (
      Math.abs(differenceX) > 45 &&
      Math.abs(differenceX) > Math.abs(differenceY) * 1.2
    ) {

      if (differenceX < 0) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(currentSlide - 1);
      }

    }

  }, { passive: true });


  /* ==========================================
     7. ADD WALIMA TO CALENDAR
     Event: 28 December 2026, 8 PM IST
  ========================================== */

  calendarButton.addEventListener("click", function () {

    const eventDetails = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hamid Khan and Saniya Khan//Walima//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:hamid-saniya-walima-20261228@invitation",
      "DTSTAMP:20261029T000000Z",
      "DTSTART;TZID=Asia/Kolkata:20261228T200000",
      "DTEND;TZID=Asia/Kolkata:20261228T230000",
      "SUMMARY:Walima Ceremony - Hamid Khan and Saniya Khan",
      "LOCATION:SONA LAWNS, Plot No. 340, Waman Tukaram Patil Marg, near Amar Talkies, next to Bank of Maharashtra, Shivneri Nagar, Chembur, Mumbai - 400043",
      "DESCRIPTION:You are cordially invited to the Walima Ceremony of Hamid Khan and Saniya Khan on Monday, 28 December 2026 at 8 PM onwards.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const calendarFile = new Blob(
      [eventDetails],
      { type: "text/calendar;charset=utf-8" }
    );

    const fileURL = URL.createObjectURL(calendarFile);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileURL;
    downloadLink.download = "Hamid-Saniya-Walima.ics";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(function () {
      URL.revokeObjectURL(fileURL);
    }, 2000);

  });


  /* ==========================================
     8. LIVE COUNTDOWN TIMER
     India Standard Time: UTC+05:30
  ========================================== */

  const eventDate = new Date("2026-12-28T20:00:00+05:30");

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");


  function updateCountdown() {

    let remaining = eventDate.getTime() - Date.now();

    if (remaining <= 0) {

      daysElement.textContent = "0";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      return;

    }

    const days = Math.floor(
      remaining / (1000 * 60 * 60 * 24)
    );

    remaining %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(
      remaining / (1000 * 60 * 60)
    );

    remaining %= 1000 * 60 * 60;

    const minutes = Math.floor(
      remaining / (1000 * 60)
    );

    const seconds = Math.floor(
      (remaining % (1000 * 60)) / 1000
    );

    daysElement.textContent = days;

    hoursElement.textContent = String(hours).padStart(2, "0");

    minutesElement.textContent = String(minutes).padStart(2, "0");

    secondsElement.textContent = String(seconds).padStart(2, "0");

  }


  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* ==========================================
     9. INITIALISE THE FIRST SLIDE
  ========================================== */

  showSlide(0);

});
