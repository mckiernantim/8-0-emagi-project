let emojiObj = {};
let words;
let allCategories = [];
let _db;
const _url = "https://pure-cove-46727.herokuapp.com/api/emojis";

fetch(_url)
  .then((data) => data.json())
  // handle data processing for alter
  .then((emojis) => {
    _db = emojis;
    // store object for fast lookup of emojiObj
    emojis.forEach((item) => {
      emojiObj[item.name] = item.symbol;
      allCategories.push(item.categories);
    });
    // make an array of ONLY the words of our emojis for later to check replace 
    words = Object.keys(emojiObj);
    // fancy trick to make an array with no repeats to use for our categories
    allCategories = [...new Set(allCategories.flat())];
    // invoke our create element function to make options to select
    allCategories.forEach((item) => makeElement(item));
  })
  .catch((e) => alert(e));

// EMOJI LOGIC

const findEmoji = (str) => {
  return _db.filter((item) => {
    return item.name.includes(str);
  });
};
const replaceEmoji = (str) => {
  const split = str.split(" ");
  for (let i = 0; i < split.length; i++) {
    for (let item of words) {
      if (split[i].toLowerCase().includes(item)) {
        // find where the emoji word exists in our input string and replace
        // the following creates a reguar expression that matches our input string -item
        // it is also given the optional flag 'g' which means this will replace this pattern 
        /// as many times as is it finds it in the string on which .replace() is called
        let toReplace = new RegExp(item, "g")
        split[i] = split[i].toLowerCase().replace(toReplace, emojiObj[item]);
      }
    }
  }
  return split.join(" ");
};

const getByCategory = (str) => {
  let categories = _db.filter((emoji) => emoji.categories.includes(str));
  return categories[Math.floor(Math.random() * categories.length)].symbol;
};

const encodePhrase = (str) => {
  let split = str.toLowerCase().split("");
  let result = "";
  split.forEach((char) => {
    let res = _db.find((emoji) => emoji.letter === char);
    if (res) {
      result += res.symbol;
    } else {
      result += char;
    }
  });
  return result;
};
// dom creation helper functions
const onSuccess = (e) => {
    // targets next sibling of event.target
  const target = e.target.nextElementSibling;
  target.classList.add("success");
  target.classList.remove("error");
  e.target.reset();
};
const onFail = (e) => {
  const target = e.target.nextElementSibling;
  target.classList.add("error");
  target.classList.remove("success");
  target.children[1].innerText = "error try again";
  e.target.reset();
};
const makeElement = (str) => {
  let el = document.createElement("option");
  el.value = str;
  el.textContent = str;
  console.log(document.getElementById("category"));
  document.getElementById("category").appendChild(el);
};

document.querySelector("#replace-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("replace-text").value;
  if (!input.length) {
    onFail(e);
  } else {
    document.querySelector("#replace-result").innerText = replaceEmoji(input);
    onSuccess(e);
  }
});

document.querySelector("#category-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.category.value;
  console.log(input);
  if (input === "none") {
    onFail(e);
  } else {
    document.querySelector("#category-result").innerText = getByCategory(input);
    onSuccess(e);
  }
});

document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.search.value;
  if (input === "") {
    onFail(e);
  } else {
    document.querySelector("#search-result").innerText = "";
    let emojis = findEmoji(input);
    emojis.forEach((emoji) => {
      document.querySelector("#search-result").innerText += emoji.symbol;
    });
    onSuccess(e);
  }
});

document.querySelector("#encode-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.encode.value;
  if (input === "") {
    onFail(e);
  } else {
    document.querySelector("#encode-result").innerText = encodePhrase(input);
    onSuccess(e);
  }
});
