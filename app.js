var game_container;
var game_image;
var game_image_current = 1;
var text_container;
var wrong_container;

var win_sound;
var correct_sound;
var loss_sound;
var wrong_sound;

var guess_correct;
var guess_char;
var previous_guess_char = "";

var keys;

var capitals = [
  "Tirana",
  "Andora",
  "Beč",
  "Brisel",
  "Minsk",
  "Sarajevo",
  "Sofija",
  "Podgorica",
  "Prag",
  "Kopenhagen",
  "Talin",
  "Helsinki",
  "Pariz",
  "Atina",
  "Tbilisi",
  "Amsterdam",
  "Zagreb",
  "Dublin",
  "Rejkjavik",
  "Rim",
  "Jerevan",
  "Riga",
  "Vaduz",
  "Vilnjus",
  "Luksemburg",
  "Budimpešta",
  "Skoplje",
  "La Valeta",
  "Kišinjev",
  "Monako",
  "Berlin",
  "Oslo",
  "Varšava",
  "Lisabon",
  "Bukurešt",
  "San Marino",
  "Bratislava",
  "Ljubljana",
  "Beograd",
  "Madrid",
  "Bern",
  "Stokholm",
  "London",
  "Kijev",
  "Vatikan",
]; // Words to be guessed (European capitals)
var guess_capital;

document.addEventListener("DOMContentLoaded", function () {
  win_sound = document.getElementsByClassName("win-audio")[0]; // Loads win sound
  correct_sound = document.getElementsByClassName("correct-audio")[0]; // Loads correct guess sound
  loss_sound = document.getElementsByClassName("loss-audio")[0]; // Loads loss audio sound
  wrong_sound = document.getElementsByClassName("wrong-audio")[0]; // Loads wrong audio sound

  game_container = document.getElementsByClassName("main-game")[0];
  game_image = game_container.getElementsByTagName("img")[0];

  text_container = document.getElementsByClassName("main-game-text")[0];
  wrong_container = document.getElementsByClassName("main-game-wrong")[0];

  create_keyboard(); // Create game keyboard
  start(); // Pick a random captial to guess
  while (guess_capital == previous_guess_char) {
    start(); // If the random capital is the same as the previous, generate it again
  }
  previous_guess_char = guess_capital;
  create_text_area(guess_capital); // Create letters to guess
});

function create_keyboard() {
  // Creates game keyboard
  keys = [
    "A",
    "B",
    "V",
    "G",
    "D",
    "Đ",
    "E",
    "Ž",
    "Z",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "R",
    "S",
    "T",
    "Ć",
    "U",
    "F",
    "H",
    "C",
    "Č",
    "Š",
  ];

  var keyboard_container = document.getElementsByClassName(
    "main-game-keyboard"
  )[0];

  for (var i = 0; i < keys.length; i++) {
    var key_element = document.createElement("p");
    key_element.innerText = keys[i];
    key_element.classList.add("keyboard-key");
    key_element.classList.add("clickable");
    key_element.addEventListener("click", key_pressed);

    keyboard_container.appendChild(key_element);
  }
}

function start() {
  // Generates random capital from the capitals list
  guess_capital = capitals[Math.floor(Math.random() * capitals.length)];
  game_started = true;
}

function create_text_area(guess_capital) {
  // Creates text area (letters to be guessed)
  for (var i = 0; i < guess_capital.length; i++) {
    var char_element = document.createElement("p");
    char_element.classList.add("game-text-char");
    char_element.setAttribute("value", guess_capital[i].toUpperCase());
    char_element.innerText = "?";

    text_container.appendChild(char_element);
  }
}

function update_image() {
  // Update the stickman image
  game_image_current += 1;
  if (game_image_current == 12) {
    // If the stickman is completely destroyed end the game
    game_image.src = String.raw`assets/images/stickman${game_image_current}.png`;

    loss_sound.play();
    game_over("Izgubio si!");
    return;
  }

  wrong_sound.play();
  if (game_image_current < 10) {
    game_image.src = String.raw`assets/images/stickman0${game_image_current}.png`;
  } else {
    game_image.src = String.raw`assets/images/stickman${game_image_current}.png`;
  }
}

function update_wrong(target_key) {
  // If the guess is wrong add the guess letter to wrong letters
  var wrong_keys = wrong_container.getElementsByClassName("game-wrong-char");
  var no_wrong_keys = wrong_container.getElementsByClassName(
    "game-nowrong-char"
  )[0];

  if (no_wrong_keys) {
    // Removes no wrong keys message
    wrong_container.removeChild(no_wrong_keys);
  }

  for (var i = 0; i < wrong_keys.length; i++) {
    if (wrong_keys[i].innerText == target_key) {
      return;
    }
  }

  var body = document.getElementsByTagName("body")[0];
  // Shakes the screen when player enters wrong letter
  body.style.animationName = "shake";
  body.style.animationDuration = "0.75s";
  body.style.animationIterationCount = "once";
  body.addEventListener("animationend", remove_animation);

  var char_element = document.createElement("p");
  char_element.classList.add("game-wrong-char");
  char_element.innerText = target_key;

  wrong_container.appendChild(char_element);
}

function remove_animation(event) {
  // Reset animation so it can be activated again later
  var body = document.getElementsByTagName("body")[0];
  body.style.animationName = "";
  body.style.animationDuration = "";
  body.style.animationIterationCount = "";
}

function remove_key(target_key) {
  // Fades out wrong key on keyboard
  var keyboard_container = document.getElementsByClassName(
    "main-game-keyboard"
  )[0];
  var keys = keyboard_container.getElementsByClassName("keyboard-key");
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].innerText == target_key) {
      //keyboard_container.removeChild(keys[i]);
      fade_out(keys[i]);
      keys[i].classList.remove("clickable");
    }
  }
}

function set_red(target_key) {
  // Sets wrong key's background to red
  var keyboard_container = document.getElementsByClassName(
    "main-game-keyboard"
  )[0];
  var keys = keyboard_container.getElementsByClassName("keyboard-key");
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].innerText == target_key) {
      keys[i].style.background = "red";
      keys[i].style.color = "white";
    }
  }
}

function set_green(target_key) {
  // Sets correct key's background to green
  var keyboard_container = document.getElementsByClassName(
    "main-game-keyboard"
  )[0];
  var keys = keyboard_container.getElementsByClassName("keyboard-key");
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].innerText == target_key) {
      keys[i].style.background = "green";
      keys[i].style.color = "white";
    }
  }
}

function game_over(result) {
  // Ends the game
  var keyboard_container = document.getElementsByClassName(
    "main-game-keyboard"
  )[0];
  var keys = keyboard_container.getElementsByClassName("keyboard-key");
  for (var i = 0; i < keys.length; i++) {
    // Disables clicking on keyboard keys
    keys[i].removeEventListener("click", key_pressed);
    if (keys[i].classList.contains("clickable")) {
      keys[i].classList.remove("clickable");
    }
  }

  var result_paragraph = document.createElement("p");
  result_paragraph.classList.add("game-text-char");
  // Sets winner
  result_paragraph.innerText = result;

  var refresh_button = document.createElement("button");
  refresh_button.classList.add("refresh-button");
  refresh_button.addEventListener("click", function () {
    // Starts new game when clicked
    window.location.reload();
  });
  refresh_button.innerText = "Započni novu igru";

  text_container.innerHTML = "";
  text_container.appendChild(result_paragraph);
  text_container.appendChild(refresh_button);
}

function key_pressed(event) {
  // Hanldes key presses
  var target_key = event.target.innerText;

  var char_fields = document.getElementsByClassName("game-text-char");
  for (var i = 0; i < char_fields.length; i++) {
    if (char_fields[i].getAttribute("value") == target_key) {
      correct_sound.play();

      char_fields[i].innerText = char_fields[i].getAttribute("value");
      guess_correct = true;
      guess_char = target_key;

      // Test if the player won
      test_win();
    }
  }

  if (!guess_correct) {
    // Handles wrong letter input
    update_image();
    update_wrong(target_key);
    set_red(target_key);
  } else {
    set_green(target_key);
  }

  remove_key(target_key);
  guess_correct = false;
}

function test_win() {
  // Tests if player won
  var char_fields = document.getElementsByClassName("game-text-char");
  for (var i = 0; i < char_fields.length; i++) {
    if (char_fields[i].getAttribute("value") != char_fields[i].innerText) {
      return;
    }
  }

  win_sound.play();
  game_over("Pobijedio si!");
}

function fade_out(key) {
  // Fade out key
  key.style.opacity = 0.3;
  key.removeEventListener("click", key_pressed);
}
