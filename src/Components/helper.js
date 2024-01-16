import { v4 } from 'uuid';

import AES from 'crypto-js/aes';

import Utf8 from 'crypto-js/enc-utf8';


export function clickOutside(node) {

  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('click_outside', node)
      )
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}



export function generateUUID() {
  return v4()
}



export function encrypt(message, secret_key) {
  return AES.encrypt(message, secret_key).toString();
}

export function decrypt(ciphertext, secret_key) {
  return AES.decrypt(ciphertext, secret_key).toString(Utf8);
}

export function Toast(text, status = "success") {
  if (status == "success") {
    // @ts-ignore
    Toastify({

      text: text,

      duration: 3000

    }).showToast();
  } else {
    // @ts-ignore
    Toastify({

      text: text,

      duration: 3000,
      style: {
        background: "linear-gradient(to right, #ef4444, #b91c1c)",
      },

    }).showToast();
  }
}

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

import { writable } from 'svelte/store';

// Create a writable store
export const User = writable(null);


export let MediaPrice = {
  Jawa: {
    tabloid: 10000,
    majalah: 10000,
    buletin: 500,
  },
  "Luar Jawa": {
    tabloid: 17000,
    majalah: 14000,
    buletin: 500,
  },
};


export function dataToJSON(data) {
  const jsonArr = [];

  data.forEach(line => {
    const [name, status,] = line.split('\t');
    jsonArr.push({ name: name, status: status });
  });

  return jsonArr
}

export function jumlah_kelompok_hp(hp_data){
  
  let guru_kelompok = {};

  hp_data.forEach(item => {
    if (guru_kelompok[`${item.hari} ${item.jam} ${item.guru}`] == undefined) {
      guru_kelompok[`${item.hari} ${item.jam} ${item.guru}`] = 1;
    }
    else {
      guru_kelompok[`${item.hari} ${item.jam} ${item.guru}`] += 1;
    }
  })

  return Object.keys(guru_kelompok).length;
}