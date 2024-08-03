const time_sleep_crawl_chap = 10000 // ms của bước 3
 
 
 // add listener
 document.getElementById("btn-b-1").addEventListener("click", prepareTruyenMoiCapNhat);
 document.getElementById("btn-b-2").addEventListener("click", crawlTruyenMoiCapNhat);
 document.getElementById("btn-b-3").addEventListener("click", crawlChap);

 async function deleteAllTruyen() {
     const myHeaders = new Headers();
     myHeaders.append("Content-Type", "application/json");

     const raw = "";

     const requestOptions = {
         method: "DELETE",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
     };

     await fetch("/api/crawl/upsert-crawl-truyen-moi-daily/delete", requestOptions)
         .then((response) => response.text())
         .then((result) => console.log(result))
         .catch((error) => console.error(error));
 }

 async function prepareCrawl() {
     const myHeaders = new Headers();

     const requestOptions = {
         method: "GET",
         headers: myHeaders,
         redirect: "follow"
     };

     await fetch("/api/crawl/prepare-crawl", requestOptions)
         .then((response) => response.text())
         .then((result) => console.log(result))
         .catch((error) => console.error(error));
 }

 // bước 1
 async function prepareTruyenMoiCapNhat() {
     const b1 = document.getElementById("buoc-1");
     b1.innerHTML = "Đang chạy";
     b1.style.color = "red";

     await deleteAllTruyen();
     await prepareCrawl();

     b1.innerHTML = "Đang cào data truyện mới cập nhật";
     b1.style.color = "red";

     const trang2 = window.open('https://truyenfull.io/danh-sach/truyen-moi/', '_blank');
     setTimeout(() => {
         trang2.close();
     }, 10000);

     setTimeout(() => {
         const trang2 = window.open('https://truyenfull.io/danh-sach/truyen-moi/trang-2/', '_blank');
         setTimeout(() => {
             trang2.close();
         }, 10000);
     }, 3000);

     setTimeout(() => {
         const trang2 = window.open('https://truyenfull.io/danh-sach/truyen-moi/trang-3/', '_blank');
         setTimeout(() => {
             trang2.close();
         }, 10000);
     }, 7000);

     setTimeout(() => {
         const trang2 = window.open('https://truyenfull.io/danh-sach/truyen-moi/trang-4/', '_blank');
         setTimeout(() => {
             trang2.close();
         }, 10000);
     }, 11000);

     setTimeout(() => {
         const trang2 = window.open('https://truyenfull.io/danh-sach/truyen-moi/trang-5/', '_blank');
         setTimeout(() => {
             trang2.close();
             b1.innerHTML = "Xong bước 1";
             b1.style.color = "green";
         }, 10000);
     }, 15000);
 }


 // lấy all tryện mới cập nhật
 async function getAllTruyenMoiCapNhat() {
     const myHeaders = new Headers();
     myHeaders.append("Content-Type", "application/json");

     const requestOptions = {
         method: "GET",
         headers: myHeaders,
         redirect: "follow"
     };

     let data = []
     await fetch("/api/crawl/upsert-crawl-truyen-moi-daily", requestOptions)
         .then((response) => response.json())
         .then((result) => data = result)
         .catch((error) => console.error(error));
     return data; // trả về dữ liệu
 }

 // bước 2
 async function crawlTruyenMoiCapNhat() {
     const b2 = document.getElementById("buoc-2");
     b2.innerHTML = "Đang chạy";
     b2.style.color = "red";
     const data = await getAllTruyenMoiCapNhat();
     for (let i = 0; i < data.length; i++) {
         const truyen = data[i];
         const truyenId = truyen.truyen_id;
         const truyenUrl = "https://truyenfull.io/" + truyenId;

         const trang2 = window.open(truyenUrl, '_blank');
         setTimeout(() => {
             trang2.close();
         }, 8000);
         await sleep(3000);
     }
     b2.innerHTML = "Xong bước 2";
     b2.style.color = "green";
 }


 // bước 3 cài chap
 async function crawlChap() {
     const b3 = document.getElementById("buoc-3");
     b3.innerHTML = "Đang chạy";
     b3.style.color = "red";

     const dataTruyen = await getAllTruyenMoiCapNhat();
     const data = await getChapData(dataTruyen.map((truyen) => truyen.truyen_id));

     for (let i = 0; i < data.length; i++) {
         const truyen = data[i];
         const truyenId = truyen.id;
         const truyenUrl = "https://truyenfull.io/" + truyenId + "/" + truyen.chap_id;
         const trang2 = window.open(truyenUrl, '_blank');
         await sleep(time_sleep_crawl_chap);
     }

     b3.innerHTML = "Xong bước 3";
     b3.style.color = "green";
 }

 // lấy dữ liệu để cào chap theo tập tiếp theo
 async function getChapData(ids) {
     const myHeaders = new Headers();
     myHeaders.append("Content-Type", "application/json");

     const raw = JSON.stringify({
         "ids": ids ? ids : []
     });

     const requestOptions = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
     };
     let data = []
     await fetch("/api/crawl/prepare-crawl-by-ids", requestOptions)
         .then((response) => response.json())
         .then((result) => data = result)
         .catch((error) => console.error(error));

     return data;
 }



 // sleep
 function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
 }