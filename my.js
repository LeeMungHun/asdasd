if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered! ', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed: ', error);
        });
    });
  }

/**
 * 백업기능 사용을 위한 변수들(const vs let)
 */
let bak_taskTitle = "";
let bak_precondition = "";
let bak_priority = "A";
let bak_steps = "";
let bak_actualResult = "";
let bak_expectedResult = "";
let bak_note = "";
let bak_version = "";

// 이미지 추가 커서를 위한 변수
let currentPosition;
let last_cur_pos;

// Task Title의 textarea 요소와 Result의 textarea 요소를 참조
const taskTitleTextarea = document.querySelector('.ta_tasktitle');
const resultTextarea = document.querySelector('.ta_result');

//입력값들 취합해서 결과값textarea에 표출
function syncResultTextarea() {
    const taskTitle = taskTitleTextarea.value.trim();
    const precondition = document.querySelector('.ta_precondition').value.trim();
    const priority = document.getElementById('priority').value;
    const steps = document.querySelector('.ta_steps').value.trim();
    const actualResult = document.querySelector('.ta_actualresult').value.trim();
    const expectedResult = document.querySelector('.ta_expectedresult').value.trim();
    const note = document.querySelector('.ta_note').value.trim();
    const version = document.querySelector('.ta_version').value.trim();

    resultTextarea.value = `*[Task Title]*\n${taskTitle}\n\n` +
        `*[Precondition]*\n${precondition}\n\n` +
        `*[Priorty]*\n${priority}\n\n` +
        `*[Steps]*\n${steps}\n\n` +
        `*[Actual Result]*\n${actualResult}\n\n` +
        `*[Expected Result]*\n${expectedResult}\n\n` +
        `*[Note]*\n${note}\n\n` +
        `*[Version]*\n${version}`;
}

// addEventListener('이벤트타입',실행 하고싶은 함수)
// 입력값 변경 사항 동기화해보기
taskTitleTextarea.addEventListener('input', syncResultTextarea);
document.querySelector('.ta_precondition').addEventListener('input', syncResultTextarea);
document.getElementById('priority').addEventListener('change', syncResultTextarea);
document.querySelector('.ta_steps').addEventListener('input', syncResultTextarea);
document.querySelector('.ta_actualresult').addEventListener('input', syncResultTextarea);
document.querySelector('.ta_expectedresult').addEventListener('input', syncResultTextarea);
document.querySelector('.ta_note').addEventListener('input', syncResultTextarea);
document.querySelector('.ta_version').addEventListener('input', syncResultTextarea);

// 페이지 로딩시 한 번 syncResultTextarea 함수를 호출하여 초기값을 설정
syncResultTextarea();


document.querySelector('.btn-reset').addEventListener('click', function () {
    // 1.백업
    backupData();

    // 2. 초기화
    taskTitleTextarea.value = '';
    document.querySelector('.ta_precondition').value = '';
    document.getElementById('priority').value = 'A';
    document.querySelector('.ta_steps').value = '';
    document.querySelector('.ta_actualresult').value = '';
    document.querySelector('.ta_expectedresult').value = '';
    document.querySelector('.ta_note').value = '';
    document.querySelector('.ta_version').value = '';

    // 3. 결과값 동기화
    syncResultTextarea();
});


// 입력 요소의 값을 백업하는 함수
function backupData() {
    // 각 입력 요소의 값을 백업 변수에 저장합니다.
    bak_taskTitle = taskTitleTextarea.value.trim();
    bak_precondition = document.querySelector('.ta_precondition').value.trim();
    bak_priority = document.getElementById('priority').value;
    bak_steps = document.querySelector('.ta_steps').value.trim();
    bak_actualResult = document.querySelector('.ta_actualresult').value.trim();
    bak_expectedResult = document.querySelector('.ta_expectedresult').value.trim();
    bak_note = document.querySelector('.ta_note').value.trim();
    bak_version = document.querySelector('.ta_version').value.trim();

}

// 되돌리기 버튼
document.querySelector('.btn-restore').addEventListener('click', function () {
    // 1. 입력값 백업 
    restoreData();
    // 2. 결과값 동기화
    syncResultTextarea();
});



// 입력값 백업
function restoreData() {
    taskTitleTextarea.value = bak_taskTitle;
    document.querySelector('.ta_precondition').value = bak_precondition;
    document.getElementById('priority').value = bak_priority;
    document.querySelector('.ta_steps').value = bak_steps;
    document.querySelector('.ta_actualresult').value = bak_actualResult;
    document.querySelector('.ta_expectedresult').value = bak_expectedResult;
    document.querySelector('.ta_note').value = bak_note;
    document.querySelector('.ta_version').value = bak_version;
}



// 이미지 이름을 현재 커서 위치에 추가하는 함수
function insertImageName(imageName) {
    const textarea = document.querySelector('.ta_result');
    currentPosition = textarea.selectionStart;
        
    if(currentPosition == 0) {
        currentPosition = last_cur_pos-1;
    }

    const textBeforeCursor = textarea.value.substring(0, currentPosition);
    const textAfterCursor = textarea.value.substring(currentPosition);

    

    // 이미지 이름을 현재 커서 위치에 추가하여 결과 textarea에 설정합니다.
    textarea.value = `${textBeforeCursor}\n!${imageName}!\n${textAfterCursor}`;

    // 드래그 앤 드롭을 위한 커서위치설정 
    const newPosition = textBeforeCursor.length + 3 + imageName.length + 2;
    textarea.setSelectionRange(newPosition, newPosition)

    last_cur_pos = newPosition;
}

// 이미지 첨부 버튼
document.querySelector('.btn-attach').addEventListener('click', function () {
    // 이미지 선택 창 오픈
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/*');
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file) {
            // 이미지 파일의 이름 추가
            insertImageName(file.name);
        }
    });
    fileInput.click();
});

// 이미지 드롭 이벤트 처리
const dropArea = document.querySelector('.result');
dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', function () {
    dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', function (e) {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
        insertImageName(file.name);
    }
});

//복사버튼
document.querySelector('.btn-copy').addEventListener('click', function () {
    resultTextarea.select();
    resultTextarea.setSelectionRange(0, resultTextarea.value.length);
    document.execCommand("Copy");
    resultTextarea.setSelectionRange(0, 0);
    alert('복사 완료');
});
