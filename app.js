const defaultData={
  titulo:"SERVIÇO DE CULTO",
  tipo:"Domingos Especiais",
  data:"2026-09-06",
  inicio:"19:00",
  itens:[
    {hora:"19:00",titulo:"Abertura",descricao:"Boas-vindas e Momentos de Louvor",responsavel:"Grupo de Louvor"},
    {hora:"19:00",titulo:"Hino 1",descricao:"HASD 15 – Tu És Fiel Senhor",responsavel:"Grupo de Louvor"},
    {hora:"19:00",titulo:"Hino 2",descricao:"HASD 212 – Bendita Segurança",responsavel:"Grupo de Louvor"},
    {hora:"19:10",titulo:"Momento de Oração",descricao:"Pelo projeto Entre Amigos",responsavel:"Luís Penteado"},
    {hora:"19:12",titulo:"Dízimos e Ofertas",descricao:"Momento de gratidão e fidelidade",responsavel:""},
    {hora:"19:20",titulo:"Mensagem",descricao:"Mensagem bíblica",responsavel:""},
    {hora:"20:00",titulo:"Encerramento",descricao:"Avisos e oração final",responsavel:""}
  ]
};
let culto=JSON.parse(localStorage.getItem("agendaCulto"))||defaultData;
const $=id=>document.getElementById(id);
function formatDate(v){if(!v)return "";const [y,m,d]=v.split("-");return `${d} de ${["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][+m-1]} de ${y}`}
function hm(v){return (v||"").replace(":", "h")+"'"}
function save(){localStorage.setItem("agendaCulto",JSON.stringify(culto))}
function render(){
  $("heroTipo").textContent=culto.tipo;$("heroTitulo").textContent=culto.titulo;
  $("heroData").textContent=formatDate(culto.data);$("heroInicio").textContent="Início: "+hm(culto.inicio);
  $("contador").textContent=`${culto.itens.length} ${culto.itens.length===1?"item":"itens"}`;
  const list=$("lista");list.innerHTML="";
  if(!culto.itens.length){list.innerHTML='<div class="empty">Nenhum item cadastrado.<br>Toque em “＋” para começar.</div>';return}
  culto.itens.forEach((it,i)=>{
    const el=document.createElement("article");el.className="item";
    el.innerHTML=`<div><div class="time">${hm(it.hora)}</div></div>
      <div><div class="num">ITEM ${i+1}</div><h3>${esc(it.titulo)}</h3><p>${esc(it.descricao)}</p>${it.responsavel?`<p><b>Responsável:</b> ${esc(it.responsavel)}</p>`:""}</div>
      <div class="item-actions"><button onclick="editarItem(${i})">✎</button><button class="del" onclick="excluirItem(${i})">×</button></div>`;
    list.appendChild(el);
  });
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function abrirModal(){
  $("modal").classList.remove("hidden");
  $("titulo").value=culto.titulo;$("tipo").value=culto.tipo;$("data").value=culto.data;$("inicio").value=culto.inicio;
  renderEditor();
}
function fechar(){$("modal").classList.add("hidden")}
function renderEditor(){
  $("editorItens").innerHTML=culto.itens.map((it,i)=>`
    <div class="edit-item"><div class="row">
      <input type="time" value="${it.hora}" onchange="alterar(${i},'hora',this.value)">
      <input value="${esc(it.titulo)}" placeholder="Título" onchange="alterar(${i},'titulo',this.value)">
      <button onclick="excluirItem(${i})">×</button>
    </div>
    <input value="${esc(it.descricao)}" placeholder="Descrição" onchange="alterar(${i},'descricao',this.value)">
    <input value="${esc(it.responsavel)}" placeholder="Responsável" onchange="alterar(${i},'responsavel',this.value)">
    </div>`).join("");
}
function alterar(i,c,v){culto.itens[i][c]=v;save();render()}
function excluirItem(i){if(confirm("Excluir este item?")){culto.itens.splice(i,1);save();render();renderEditor()}}
function editarItem(i){abrirModal();setTimeout(()=>document.querySelectorAll(".edit-item")[i]?.scrollIntoView({behavior:"smooth",block:"center"}),100)}
$("formCulto").addEventListener("submit",e=>{e.preventDefault();culto.titulo=$("titulo").value;culto.tipo=$("tipo").value;culto.data=$("data").value;culto.inicio=$("inicio").value;save();render();alert("Culto salvo com sucesso!");});
$("btnAdicionarItem").onclick=()=>{culto.itens.push({hora:culto.inicio||"19:00",titulo:"Novo momento",descricao:"Descrição da programação",responsavel:""});save();render();renderEditor();setTimeout(()=>document.querySelectorAll(".edit-item")[culto.itens.length-1]?.scrollIntoView({behavior:"smooth"}),50)}
$("btnNovo").onclick=abrirModal;$("navNovo").onclick=abrirModal;$("fecharModal").onclick=fechar;
$("navSobre").onclick=()=>$("sobre").classList.remove("hidden");$("fecharSobre").onclick=()=>$("sobre").classList.add("hidden");
$("btnImprimir").onclick=()=>window.print();
$("btnCompartilhar").onclick=async()=>{
 const texto=`${culto.titulo}\n${culto.tipo}\n${formatDate(culto.data)}\nInício: ${hm(culto.inicio)}\n\n`+
 culto.itens.map((x,i)=>`${i+1}. ${hm(x.hora)} - ${x.titulo}${x.descricao?" — "+x.descricao:""}${x.responsavel?" ("+x.responsavel+")":""}`).join("\n");
 if(navigator.share){try{await navigator.share({title:"Programação do culto",text:texto})}catch(e){}}
 else window.open("https://wa.me/?text="+encodeURIComponent(texto),"_blank");
};
render();
