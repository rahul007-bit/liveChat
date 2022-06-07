const random = () => {
  ran = (
    Math.random().toString(36).slice(10) +
    new Date().getTime().toString(36) +
    Math.random().toString(36).slice(10)
  )
    .split(/(.{5})/)
    .filter((O) => O);
  u = "";
  ran.forEach((e, i) => {
    if (i != 0) {
      u = u + "-" + e;
    } else {
      u = e;
    }
  });
  return u;
};
const roomInput = document.querySelector("#room");
const submit = document.querySelector(".btn");
const form = document.querySelector(".form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("submit");
  fetch(
    window.location.origin +
      "/newroom/" +
      roomInput.value +
      "/" +
      event.target.elements.username.value,
    {
      method: "POST",
    }
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        window.location.replace(
          window.location.origin +
            "/chat.html?username=" +
            form.childNodes[1].childNodes[1].value +
            "&room=" +
            roomInput.value
        );
      }
    })
    .catch((error) => console.log("error", error));
});

roomInput.value = random();
