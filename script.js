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
  let startX = 0;
  let startY = 0;


  /* DOOR -> VIDEO WITH ORIGINAL AUDIO */

  tapButton.addEventListener("click", async function () {

    doorScreen.hidden = true;
    videoScreen.hidden = false;

    entranceVideo.muted = false;
    entranceVideo.volume = 1;

    try {
      entranceVideo.currentTime = 0;
      await entranceVideo.play();
    } catch (error) {
      console.error("Video playback failed:", error);
      showInvitation();
    }

  });


  /* VIDEO END -> VINTAGE CARD */

  function showInvitation() {
    vintageCard.hidden = false;
    replayButton.hidden = false;
    showSlide(0);
  }

  entranceVideo.addEventListener("ended", function () {
    // Keep the video visible on its last frame behind the card.
    showInvitation();
  });

  entranceVideo.addEventListener("error", function () {
    console.error("Check the filename entrance.webm and video format.");
    showInvitation();
  });


  /* REPLAY VIDEO */

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


  /* FOUR SLIDES */

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


  /* SWIPE LEFT / RIGHT ON MOBILE */

  vintageCard.addEventListener("touchstart", function (event) {

    if (!event.changedTouches.length) return;

    startX = event.changedTouches[0].clientX;
    startY = event.changedTouches[0].clientY;

  }, { passive: true });

  vintageCard.addEventListener("touchend", function (event) {

    if (!event.changedTouches.length) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const dx = endX - startX;
    const dy = endY - startY;

    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      showSlide(currentSlide + (dx < 0 ? 1 : -1));
    }

  }, { passive: true });


  /* CALENDAR EVENT */

  calendarButton.addEventListener("click", function () {

    const eventText = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hamid Khan Weds Saniya Khan//Walima//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:hamid-saniya-walima-20261228@invitation",
      "DTSTAMP:20261029T000000Z",
      "DTSTART;TZID=Asia/Kolkata:20261228T200000",
      "DTEND;TZID=Asia/Kolkata:20261228T230000",
      "SUMMARY:Walima Ceremony - Hamid Khan Weds Saniya Khan",
      "LOCATION:SONA LAWNS, Plot No. 340, Waman Tukaram Patil Marg, near Amar Talkies, next to Bank of Maharashtra, Shivneri Nagar, Chembur, Mumbai - 400043",
      "DESCRIPTION:You are cordially invited to the Walima Ceremony on Monday, 28 December 2026 at 8:00 PM onwards.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const file = new Blob(
      [eventText],
      { type: "text/calendar;charset=utf-8" }
    );

    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = fileURL;
    link.download = "Hamid-Saniya-Walima.ics";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(fileURL);
    }, 2000);

  });


  /* LIVE COUNTDOWN: 28 DECEMBER 2026, 8 PM IST */

  const eventDate = new Date("2026-12-28T20:00:00+05:30");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {

    let remaining = eventDate.getTime() - Date.now();

    if (remaining <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");

  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  showSlide(0);

});
