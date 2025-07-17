// -------------------------------
// Firebase 初期化
// -------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZ1G8mcnYBeLQkSeSjbfvszXcrGt5Byf8",
  authDomain: "kinyoukai-app.firebaseapp.com",
  projectId: "kinyoukai-app",
  storageBucket: "kinyoukai-app.firebasestorage.app",
  messagingSenderId: "1022307284484",
  appId: "1:1022307284484:web:30f6534a0c46a8a966a751"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------------------
// ログイン処理（会社ドメイン限定）
// -------------------------------
onAuthStateChanged(auth, user => {
  if (user && user.email.endsWith("@plantec-kk.co.jp")) {
    loadData(); // ログイン済 → データ表示
  } else {
    const email = prompt("会社のメールアドレスを入力してください");
    const password = prompt("パスワードを入力してください");
    signInWithEmailAndPassword(auth, email, password)
      .catch(err => alert("ログイン失敗: " + err.message));
  }
});

// -------------------------------
// UIとイベント設定
// -------------------------------
document.getElementById("addAgendaBtn").addEventListener("click", addAgendaItem);
document.getElementById("saveBtn").addEventListener("click", saveData);

function addAgendaItem() {
  const agendaList = document.getElementById("agendaList");
  const item = document.createElement("div");
  item.className = "agenda-item";
  item.innerHTML = `
    <input type="text" placeholder="議題内容" class="agendaTitle" />
    <input type="text" placeholder="発表者名" class="presenter" />
    <input type="text" placeholder="時間（例：13:00～13:30）" class="timeSlot" />
  `;
  agendaList.appendChild(item);
}

// -------------------------------
// Firestoreにデータ保存
// -------------------------------
async function saveData() {
  const date = document.getElementById("dateInput").value;
  const chair = document.getElementById("chairInput").value;
  const agendaItems = document.querySelectorAll(".agenda-item");

  if (!date || !chair || agendaItems.length === 0) {
    alert("全ての項目を入力してください。");
    return;
  }

  const agendas = [];
  agendaItems.forEach(item => {
    const title = item.querySelector(".agendaTitle").value;
    const presenter = item.querySelector(".presenter").value;
    const time = item.querySelector(".timeSlot").value;
    if (title && presenter && time) {
      agendas.push({ title, presenter, time });
    }
  });

  try {
    await addDoc(collection(db, "kinyoukai"), {
      date,
      chair,
      agendas,
      createdAt: new Date()
    });
    alert("保存しました！");
    document.getElementById("agendaList").innerHTML = "";
    loadData(); // 再読み込み
  } catch (e) {
    alert("保存エラー: " + e.message);
  }
}

// -------------------------------
// Firestoreからデータ読み込み
// -------------------------------
async function loadData() {
  const q = query(collection(db, "kinyoukai"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  const output = document.getElementById("savedData");
  output.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>🗓 ${data.date}</h3>
      <p><strong>議長：</strong>${data.chair}</p>
      <ul>
        ${data.agendas.map(a => `<li><strong>${a.title}</strong>（${a.presenter}／${a.time}）</li>`).join("")}
      </ul>
    `;
    output.appendChild(div);
  });
}
