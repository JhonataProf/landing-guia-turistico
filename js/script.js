// Atrações de Dourados-MS com fotos e endereços
const dadosAtracoes = [
  {
    "id": "a1",
    "nome": "Praça Antônio João",
    "categoria": "historia",
    "descricao": "Praça central com monumentos históricos e eventos culturais.",
    "nota": 4.7,
    "endereco": "Centro — Av. Marcelino Pires / Av. Joaquim Teixeira Alves, Dourados, MS",
    "imagem": "https://cdn.douradosnews.com.br/img/c/780/530/dn_noticia/2011/11/4ecf62d6d61517030785a8d57eef95b1814b50d15e153.jpg",
    "mapa": "https://maps.google.com/?q=Pra%C3%A7a%20Ant%C3%B4nio%20Jo%C3%A3o%2C%20Dourados%2C%20MS",
    "geo": {
      "lat": -22.2275,
      "lng": -54.8109
    }
  },
  {
    "id": "a2",
    "nome": "Parque Antenor Martins (Parque do Lago)",
    "categoria": "parque",
    "descricao": "Área verde com lago, pistas de caminhada e quadras. Fundado em 1985.",
    "nota": 4.8,
    "endereco": "Av. José Roberto Teixeira — Jardim Flórida, Dourados, MS",
    "imagem": "https://cdn.douradosnews.com.br/img/c/780/530/dn_noticia/2017/03/58d299750483d309851cd7bda34fc4b0da4c3c567db01.jpg",
    "mapa": "https://maps.google.com/?q=Parque%20Antenor%20Martins%20Dourados%20MS",
    "geo": {
      "lat": -22.242,
      "lng": -54.805
    }
  },
  {
    "id": "a3",
    "nome": "Parque Ambiental Primo Fioravante (Rêgo d’Água)",
    "categoria": "parque",
    "descricao": "Parque linear urbano com ciclovia e áreas de descanso ao longo do córrego.",
    "nota": 4.6,
    "endereco": "Vila Bela — Dourados, MS",
    "imagem": "https://upload.wikimedia.org/wikipedia/commons/9/96/Dourados_-_Parque_dos_Ip%C3%AAs.jpg",
    "mapa": "https://maps.google.com/?q=Parque%20Ambiental%20Primo%20Fioravante%20Dourados",
    "geo": {
      "lat": -22.2245,
      "lng": -54.811
    }
  },
  {
    "id": "a4",
    "nome": "Catedral Imaculada Conceição",
    "categoria": "religioso",
    "descricao": "Igreja matriz de Dourados, com celebrações e eventos da Diocese.",
    "nota": 4.6,
    "endereco": "Rua João Cândido da Câmara, 400 — Centro, Dourados, MS",
    "imagem": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Pra%C3%A7a_Ant%C3%B4nio_Jo%C3%A3o_111409.jpg",
    "mapa": "https://maps.google.com/?q=Catedral%20Imaculada%20Concei%C3%A7%C3%A3o%20Dourados",
    "geo": {
      "lat": -22.221,
      "lng": -54.8055
    }
  },
  {
    "id": "a5",
    "nome": "Feira Central ‘João Totó Câmara’",
    "categoria": "gastronomia",
    "descricao": "Feira central com comidas típicas, produtos locais e eventos sazonais.",
    "nota": 4.5,
    "endereco": "Rua Cafelândia — Jardim São Pedro, Dourados, MS",
    "imagem": "https://upload.wikimedia.org/wikipedia/commons/9/96/Dourados_-_Parque_dos_Ip%C3%AAs.jpg",
    "mapa": "https://maps.google.com/?q=Feira%20Central%20Jo%C3%A3o%20Tot%C3%B3%20C%C3%A2mara%20Dourados",
    "geo": {
      "lat": -22.2078,
      "lng": -54.7885
    }
  },
  {
    "id": "a6",
    "nome": "Museu Histórico Municipal (acervo local)",
    "categoria": "museu",
    "descricao": "Espaço dedicado à memória e cultura da região (confira horários).",
    "nota": 4.2,
    "endereco": "Centro — Dourados, MS",
    "imagem": "https://upload.wikimedia.org/wikipedia/commons/9/96/Dourados_-_Parque_dos_Ip%C3%AAs.jpg",
    "mapa": "https://maps.google.com/?q=Museu%20Hist%C3%B3rico%20Municipal%20Dourados",
    "geo": {
      "lat": -22.22,
      "lng": -54.81
    }
  }
];

let termo = '';
let categoria = '';
let ordenar = 'relevancia';

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const lista = $('#listaAtracoes');
const tpl = $('#cardTemplate');
const buscaInput = $('#busca');
const buscaForm = $('#buscaForm');
const filtroCategoria = $('#filtroCategoria');
const ordenarPor = $('#ordenarPor');
const anoAtual = $('#anoAtual');
const btnTema = $('#btnTema');

(function initTema(){
  const temaSalvo = localStorage.getItem('tema') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = temaSalvo;
  if (btnTema) {
    btnTema.setAttribute('aria-pressed', temaSalvo === 'dark');
    btnTema.addEventListener('click', () => {
      const novo = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
      document.documentElement.dataset.theme = novo;
      localStorage.setItem('tema', novo);
      btnTema.setAttribute('aria-pressed', novo === 'dark');
    });
  }
})();

if (anoAtual) anoAtual.textContent = new Date().getFullYear();

function render(atracoes) {
  if (!lista) return;
  lista.innerHTML = '';
  const frag = document.createDocumentFragment();

  atracoes.forEach(a => {
    const node = tpl.content.cloneNode(true);
    const link = node.querySelector('.card__media');
    const img = node.querySelector('img');
    const title = node.querySelector('.card__title');
    const desc = node.querySelector('.card__desc');
    const ddCat = node.querySelector('.categoria');
    const ddAval = node.querySelector('.avaliacao');
    const ddEnd = node.querySelector('.endereco');
    const btnFav = node.querySelector('[data-acao="favoritar"]');
    const btnMapa = node.querySelector('.card__actions a');

    link.href = a.mapa;
    img.src = a.imagem;
    img.referrerPolicy = 'no-referrer';
    img.alt = `${a.nome} — ${a.descricao}`;
    title.textContent = a.nome;
    desc.textContent = a.descricao;
    ddCat.textContent = a.categoria;
    ddAval.textContent = '★'.repeat(Math.round(a.nota)) + ` (${a.nota.toFixed(1)})`;
    ddEnd.textContent = a.endereco;
    btnMapa.href = a.mapa;

    const favKey = `fav:${a.id}`;
    const fav = localStorage.getItem(favKey) === '1';
    btnFav.setAttribute('aria-pressed', fav);
    btnFav.textContent = fav ? 'Favorito ✓' : 'Favoritar';
    btnFav.addEventListener('click', () => {
      const isFav = btnFav.getAttribute('aria-pressed') === 'true';
      const next = !isFav;
      btnFav.setAttribute('aria-pressed', String(next));
      btnFav.textContent = next ? 'Favorito ✓' : 'Favoritar';
      localStorage.setItem(favKey, next ? '1' : '0');
    });

    const jsonLd = document.createElement('script');
    jsonLd.type = 'application/ld+json';
    jsonLd.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": a.nome,
      "description": a.descricao,
      "image": a.imagem,
      "address": a.endereco,
      "geo": { "@type": "GeoCoordinates", "latitude": a.geo.lat, "longitude": a.geo.lng },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": a.nota, "reviewCount": Math.floor(a.nota*120) }
    });
    node.appendChild(jsonLd);

    frag.appendChild(node);
  });
  lista.appendChild(frag);
  observeFadeIn();
}

function compute() {
  let arr = [...dadosAtracoes];
  if (termo) {
    const t = termo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    arr = arr.filter(a => [a.nome, a.descricao, a.endereco].join(' ')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(t));
  }
  if (categoria) arr = arr.filter(a => a.categoria === categoria);
  if (ordenar === 'avaliacao') arr.sort((a,b)=> b.nota - a.nota);
  if (ordenar === 'distancia') arr.sort((a,b)=> a.geo.lat - b.geo.lat);
  render(arr);
}

if (buscaForm) buscaForm.addEventListener('submit', (e) => { e.preventDefault(); termo = buscaInput.value.trim(); compute(); history.replaceState({}, '', `?q=${encodeURIComponent(termo)}`) });
if (filtroCategoria) filtroCategoria.addEventListener('change', (e)=> { categoria = e.target.value; compute(); });
if (ordenarPor) ordenarPor.addEventListener('change', (e)=> { ordenar = e.target.value; compute(); });

function observeFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('is-visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

compute();
