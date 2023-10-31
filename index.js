const modal_container = document.querySelector('.modal_container');
const modal = document.querySelector('.modal');
const open_modal = document.querySelector('.add_button');
const close_modal = document.querySelector('.close');
const add_user = document.querySelector('.add_user');
const update_user = document.querySelector('.update_user');
const inp_name = document.querySelector('#name');
const inp_email = document.querySelector('#email');
let cnt = 0;
let idx = 0;
let users = [];
let toast;
const email_validator = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

//Code to retrive users cookie
function getCookieValue(cookieName) {
  const name = cookieName + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}
//Store the value of users cookies into users array
function Set_users_on_load() {
  const userCookie = getCookieValue('users');

  if (userCookie !== null) {
    const user_array = JSON.parse(userCookie);
    users = user_array;
    cnt = users.length > 0 ? users[users.length - 1].id : 0;
    UserList(users);
  } else {
    console.log('Cookie not found or is empty.');
  }
}

//Connect users array with frontend using map function
function UserList(user_arr) {
  if (user_arr.length <= 0) {
    document.querySelector(
      '.user_info'
    ).innerHTML = `<div class="no_user"><h1>No users are there</h1></div>`;
  } else {
    let list = user_arr.map((user, idx) => {
      return ` <div class="user ${idx % 2 == 0 ? '' : 'odd'}">
             <div class="name"><h2>${user.name}</h2></div>
             <div class="email"><h2>${user.email}</h2></div>
             <div>
                <i class="fa-solid fa-pen-to-square" id="edit" onclick="EditUser(${
                  user.id
                })"></i> 
             </div>
             <div>
               <i class="fa-solid fa-trash" id="delete" onclick="DeleteUser(${
                 user.id
               })"></i>
             </div>
           </div>`;
    });
    list = list.join(' ');
    document.querySelector('.user_info').innerHTML = list;
  }
}

//Generate ToastBox whenever array related tasks are performed
function ToastBox(msg, color) {
  toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = msg;
  toast.style.background = color;
  document.querySelector('body').appendChild(toast);
}
//Will remove the html code for ToastBox after 3s
function ClearToast() {
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

//Will Check whether user email is valid or not through regular expression
function ValidateEmail(email) {
  if (email_validator.test(email)) {
    console.log('Valid email address');
    return true;
  } else {
    console.log('Invalid email address');
    return false;
  }
  return false;
}

//Function to open and close the modal container to add and update users
function OpenModal() {
  modal.classList.add('open_modal');
  modal_container.classList.add('modal_animation');
}
function CloseModal() {
  modal.classList.remove('open_modal');
  modal_container.classList.remove('modal_animation');
}
open_modal.addEventListener('click', OpenModal);
close_modal.addEventListener('click', CloseModal);

window.addEventListener('load', Set_users_on_load); //set the users array when window will be lodaded

//Add the user to the users array
add_user.addEventListener('click', () => {
  let username = inp_name.value;
  let useremail = inp_email.value;
  const email = ValidateEmail(useremail); //validating email
  if (username && email) {
    cnt++;
    users.push({
      id: cnt,
      name: username,
      email: useremail,
    });
    inp_name.value = ''; //reseting input fields
    inp_email.value = '';
    CloseModal();
    UserList(users); //mapping newly added users with frontend
    ToastBox('User added successfully', '#26c74d');
  } else {
    ToastBox('Enter valid name or email', 'crimson');
  }
  ClearToast();
});

//Delete the users from the array
function DeleteUser(id) {
  let user = users.filter((user) => {
    if (user.id != id) return user; // return new array called user
  });
  users = user; //updating users array
  UserList(users);
  ToastBox('User deleted successfully', 'dodgerblue');
  ClearToast();
}

//Function to edit user
function EditUser(id) {
  add_user.style.display = 'none';
  update_user.style.display = 'block';
  OpenModal();
  const info = users.find((user) => user.id == id);
  inp_name.value = info.name; //set the input field which contain saved value of users
  inp_email.value = info.email;

  for (let i = 0; i < users.length; i++) {
    //perform search operation on users array
    if (users[i].id === info.id) {
      idx = i; // update the index number
      break;
    }
  }
}

function UpdateUser() {
  users[idx].name = inp_name.value; //will update the user through index number
  users[idx].email = inp_email.value;
  UserList(users);
  CloseModal();
  add_user.style.display = 'block';
  update_user.style.display = 'none';
  inp_name.value = '';
  inp_email.value = '';
  ToastBox('User updated successfully', '#f9d949');
  ClearToast();
}
update_user.addEventListener('click', UpdateUser);

//Use to save users array into cookies before window gets close
function setcookie() {
  const usersJSON = JSON.stringify(users);
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30); //set expires equal to 30 days from current day
  document.cookie = `users=${usersJSON}; expires=${expirationDate.toUTCString()}`;
}
window.addEventListener('beforeunload', setcookie);
