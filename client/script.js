import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadIterval;


function loader(element){
  element.textContent = '';

  loadIterval = setInterval(() =>{
    element.textContent += '.';

    if(element.textContent === '....'){
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text){
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}



function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `
}


const handelSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user chatstripe

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const respoense = await fetch('https://nano-31tc.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadIterval);
  messageDiv.innerHTML = '';

  if(respoense.ok){
    const data = await respoense.json();
    const parsedData = data.bot.trim();

console.log({parsedData});

    typeText(messageDiv, parsedData);
  }else{
    const err = await respoense.text();
    messageDiv.innerHTML =" something went wrong";

    alert(err);
  }
}

form.addEventListener('submit', handelSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13){
    handelSubmit(e);
  }
})