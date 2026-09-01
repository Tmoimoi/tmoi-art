// 端到端验证 文案清单.html 的编辑功能
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(
  "/Users/tmoi/WorkBuddy/Tmoi 个人网站/文案清单.html",
  "utf-8"
);
const url = "http://localhost/";
const opts = {
  url,
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.confirm = () => true;
  },
};

const dom = new JSDOM(html, opts);
const { window } = dom;
const { document } = window;
let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log("  ✓", msg); }
  else { fail++; console.log("  ✗", msg); }
}

console.log("== 1. 结构 ==");
ok(document.querySelectorAll("td.ed").length > 400, "可编辑单元格已渲染");
ok(document.querySelector("#editor").hidden === true, "编辑面板初始隐藏");

console.log("== 2. 编辑 A-01 中文 ==");
const btnA = document.querySelector('td.ed[data-id="A-01"][data-lang="zh"] .eb');
ok(!!btnA, "找到 A-01 中文编辑按钮");
btnA.click();
ok(!document.querySelector("#editor").hidden, "点击后面板打开");
ok(document.getElementById("ed-id").textContent === "A-01", "面板标题显示编号 A-01");
const input = document.getElementById("ed-input");
const oldZh = input.value;
ok(oldZh.length > 0, "输入框显示当前文本: " + oldZh.slice(0, 20) + "…");
input.value = "改过的中文文案·测试";
input.dispatchEvent(new window.Event("input", { bubbles: true }));
document.getElementById("ed-save").click();
const tdA = document.querySelector('td.ed[data-id="A-01"][data-lang="zh"]');
ok(tdA.querySelector(".txt").textContent.includes("改过的中文文案·测试"), "保存后单元格文本已同步更新");
ok(tdA.classList.contains("modified"), "单元格标记为已修改");
ok(document.getElementById("chg-n").textContent === "1", "顶部计数 = 1");
const stored = JSON.parse(window.localStorage.getItem("tmoi_copy_edits_v1") || "{}");
ok(stored["A-01|zh"] && stored["A-01|zh"].cur.includes("改过的中文文案·测试"), "localStorage 已写入");
ok(stored["A-01|zh"].orig === oldZh, "原文被记录（可恢复）");

console.log("== 3. 编辑 B-01（复合结构：名字+一句话） ==");
const btnB = document.querySelector('td.ed[data-id="B-01"][data-lang="zh"] .eb');
btnB.click();
const inputB = document.getElementById("ed-input");
ok(inputB.value.includes("\n"), "B 组输入框含换行（名字/说明分行）");
inputB.value = "新展厅名\n新的一句话说明";
document.getElementById("ed-save").click();
const tdB = document.querySelector('td.ed[data-id="B-01"][data-lang="zh"]');
ok(tdB.querySelector(".txt b") && tdB.querySelector(".txt b").textContent === "新展厅名", "B 组首行仍加粗");
ok(tdB.querySelector(".txt .sub") && tdB.querySelector(".txt .sub").textContent.includes("新的一句话说明"), "B 组说明仍在 sub 中");

console.log("== 4. 编辑 D-01 title → 折叠标题同步 ==");
const btnD = document.querySelector('td.ed[data-id="D-01.title"][data-lang="zh"] .eb');
ok(!!btnD, "找到 D-01.title 中文编辑按钮");
btnD.click();
const inputD = document.getElementById("ed-input");
inputD.value = "新标题·测试";
document.getElementById("ed-save").click();
const tdD = document.querySelector('td.ed[data-id="D-01.title"][data-lang="zh"]');
ok(tdD.querySelector(".txt").textContent === "新标题·测试", "title 单元格已更新");
ok(document.getElementById("title-01").textContent === "新标题·测试", "折叠行标题同步更新");

console.log("== 5. 英文编辑 + 切换 tab ==");
const btnE2 = document.querySelector('td.ed[data-id="A-02"][data-lang="en"] .eb');
btnE2.click();
ok(document.getElementById("ed-input").value.length > 0, "EN tab 显示英文原文");
const tabs = document.querySelectorAll(".lang-tab");
ok(tabs[0].classList.contains("active") === false, "切到 EN 后中 tab 取消激活");

console.log("== 6. 导出报告 ==");
// 重新从 localStorage 读取最新状态（stored 是第 2 步的快照，不反映后续保存）
const fresh = JSON.parse(window.localStorage.getItem("tmoi_copy_edits_v1") || "{}");
const keys = Object.keys(fresh);
ok(keys.length === 3, "共 3 条修改被记录: " + keys.join(", "));

console.log("== 7. 刷新后恢复（新实例） ==");
const dom2 = new JSDOM(html, {
  url,
  runScripts: "dangerously",
  beforeParse(w2) {
    // 预置 localStorage（用最新的 fresh）
    const before = new JSDOM("", { url });
    before.window.localStorage.setItem("tmoi_copy_edits_v1", JSON.stringify(fresh));
    Object.defineProperty(w2, "localStorage", { value: before.window.localStorage });
    w2.confirm = () => true;
  },
});
const doc2 = dom2.window.document;
const restored = doc2.querySelector('td.ed[data-id="A-01"][data-lang="zh"]');
ok(restored.querySelector(".txt").textContent.includes("改过的中文文案·测试"), "刷新后 A-01 修改保留");
ok(restored.classList.contains("modified"), "刷新后 modified 标记保留");
ok(doc2.querySelector('td.ed[data-id="D-01.title"][data-lang="zh"] .txt').textContent === "新标题·测试", "刷新后 D-01 title 保留");
ok(doc2.getElementById("title-01").textContent === "新标题·测试", "刷新后折叠标题同步");
ok(doc2.getElementById("chg-n").textContent === "3", "刷新后计数 = 3");

console.log("== 8. 恢复原文 ==");
const btnR = doc2.querySelector('td.ed[data-id="A-01"][data-lang="zh"] .eb');
btnR.click();
doc2.getElementById("ed-restore").click();
const tdR = doc2.querySelector('td.ed[data-id="A-01"][data-lang="zh"]');
ok(!tdR.classList.contains("modified"), "恢复后去掉 modified 标记");
ok(tdR.querySelector(".txt").textContent === oldZh, "恢复为原文");

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
