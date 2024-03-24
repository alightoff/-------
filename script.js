//  Общий элемент видимого контента
const mainBlock = document.querySelector('.main');

// Элементы левой части экрана
const leftSide = document.querySelector('.left__side');
const leftSideBtn = document.querySelectorAll('.left__side-btn');
const leftSideFiles = document.querySelector('.left__side-files');

// Кнопки левой части экрана
const btnSave = document.querySelector('#btn__save');
const btnNewFile = document.querySelector('#btn__new-file');
const btnClear = document.querySelector('#btn__clear');
const btnDownload = document.querySelector('#btn__download');
const btnDelete = document.querySelectorAll('.delete');
const deleteItem = document.querySelector('.delete-item');

// Основная часть блокнота: Имя и сам блокнот
const mainNotebook = document.querySelector('.main__notebook');
const mainNotebookTitle = document.querySelector('.main__notebook-title');
const block = document.querySelector('.block');
const mainNotebookTitleItem = document.querySelector('.main__notebook-title-item')

// const mainNotebookFilesBtn = document.querySelector('.main__notebook-files-btn');
const notebook = document.querySelector('.notebook');

// Модальное окно
const modalWindow = document.querySelector('.modal__window');
const modalWindowCross = document.querySelector('.modal__window-cross');
const opacity = document.querySelector('.opacity');

// Объект с записями
const notesInTheNotebook = {};

// Временные переменные
let nameOfFile;
let NAMEOFFILE;
let count = 1;




// Изначально у кнопки сохраения и блокнота запрет на интеррактивность до того момента, когда пользователь не создаст файл
notebook.setAttribute('disabled', '');
btnSave.setAttribute('disabled', '');

const newFileBtnFunc = () => {
  btnNewFile.addEventListener('click', (e) => {
    e.preventDefault();
  
    if (count == 1) {
      // Задается имя для файла
      nameOfFile = prompt('Введите имя файла:').trim();
  
      // Если пользователь еще не нажал на кноаку добавления файла он не может писать
      if (nameOfFile) {
        notebook.removeAttribute('disabled', '')
        notebook.value = '';
      }
  
      // Добавление названия текстового файла
      if (mainNotebookTitle.childNodes[1]) {
        mainNotebookTitle.childNodes[1].remove();
        mainNotebookTitle.insertAdjacentHTML('beforeend', `<h2 class="main__notebook-title-item">${nameOfFile}</h2>`);
      } else {
        mainNotebookTitle.insertAdjacentHTML('beforeend', `<h2 class="main__notebook-title-item">${nameOfFile}</h2>`);
      }
  
      // Добавление в объект ключ со свойством в виде массива
      NAMEOFFILE = nameOfFile.split(' ').join('');
      notesInTheNotebook[NAMEOFFILE] = [notebook.value];
  
  
      // Добавление функционала, чтоб пользователь мог создать только 1 файл;
      count++;
  
      if (count == 2) {
        btnNewFile.setAttribute('disabled', '');
        btnSave.removeAttribute('disabled');
      };
    } else {
      mainNotebookTitle.value = '';
      nameOfFile = '';
      console.log(count);
      newFileBtnFunc();
    }
  });
}
newFileBtnFunc();



// При клике на кнопку "Сохранить" создается элемент в html с кнопкой перемещения по файлам

const createFileButton = (fileName) => {
  return `
    <div class="saved__file-item">
      <button class="saved__file" id="${fileName}" onclick="openSavedFile(this)">${fileName}</button>
      <div class="delete" id="${fileName}" onclick="deleteSavedFile(this)"><img class="delete-item" src="./img/trash_yrrd24oatwo6.svg" alt="trash"></div>
    </div>
  `;
}

let saveCount = 0;

const saveFunc = () => {
  btnSave.addEventListener('click', (e) => {
    e.preventDefault();

    notesInTheNotebook[NAMEOFFILE] = [notebook.value];

    // Очищаем левую часть экрана от предыдущих кнопок файлов
    leftSideFiles.innerHTML = '';

    // Добавляем кнопки файлов для всех сохраненных файлов
    for (const fileName in notesInTheNotebook) {
      leftSideFiles.insertAdjacentHTML('beforeend', createFileButton(fileName));
    }

    if (count == 1) {
    } else if (count == 2) {
      count--;
    }
    

    if (saveCount == 0) {
      btnNewFile.removeAttribute('disabled');
    };
      // saveCount++;
    console.log(notesInTheNotebook);
  })
}

saveFunc()



// Кнопка для чистки контента из textarea

btnClear.addEventListener('click', (e) => {
  e.preventDefault();
  notebook.value = '';
})


// Перемещение по файлам по кнопкам левой части экрана

const openSavedFile = (el) => {
  Object.entries(notesInTheNotebook).forEach(([key, val]) => {
    if (key == el.id) {
      // console.log(val);
      // console.log(key);
      notebook.value = val;
      nameOfFile = key;
      NAMEOFFILE = key;
      if (mainNotebookTitle.childNodes[1]) {
        mainNotebookTitle.childNodes[1].remove();
        mainNotebookTitle.insertAdjacentHTML('beforeend', `<h2 class="main__notebook-title-item">${key}</h2>`);
      } else {
        mainNotebookTitle.insertAdjacentHTML('beforeend', `<h2 class="main__notebook-title-item">${key}</h2>`);
      }
    }
  })
};


// Modal Window

btnDownload.addEventListener('click', (e) => {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  opacity.classList.remove('hidden');
  document.body.classList.add('scroll__hidden');
})

modalWindowCross.addEventListener('click', (e) => {
  e.preventDefault();
  modalWindow.classList.add('hidden');
  opacity.classList.add('hidden');
  document.body.classList.remove('scroll__hidden');
})

opacity.addEventListener('click', (e) => {
  e.preventDefault();
  modalWindow.classList.add('hidden');
  opacity.classList.add('hidden');
  document.body.classList.remove('scroll__hidden');
})


const fileNameEle = document.getElementById("fileName");
const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const textData = notebook.value;
  const textDataBlob = new Blob([notebook.value], { type: "text/plain" });

  const downloadUrl = window.URL.createObjectURL(textDataBlob);

  const downloadLink = document.createElement('a');
  downloadLink.download = fileNameEle.value
  downloadLink.href = downloadUrl;
  downloadLink.click()

  console.log(textData);
  console.log(textDataBlob);
});

const deleteSavedFile = (el) => {
  Object.entries(notesInTheNotebook).forEach(([key, val], i) => {
    if (el.id == key) {
      while (leftSideFiles.firstChild) {
        leftSideFiles.removeChild(leftSideFiles.firstChild);
      }
      delete notesInTheNotebook[key];
      notebook.value = '';
      if (mainNotebookTitle.childNodes[1]) {
        mainNotebookTitle.childNodes[1].remove();
      }
    }
  })

  for (const fileName in notesInTheNotebook) {
    leftSideFiles.insertAdjacentHTML('beforeend', createFileButton(fileName));
  }
}
deleteSavedFile()