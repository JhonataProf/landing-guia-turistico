const dadosAtracoes = [
  { id: 'a1', nome: 'Praca Central', categoria: 'historia', descricao: 'Centro historico com cafes.', nota: 4.7, endereco: 'Av. Principal, 123 - Centro', imagem: '/assets/img/praca.jpg', mapa: 'https://maps.google.com/?q=Praca Central', geo: { lat: -22.2201, lng: -54.8065 } },
  { id: 'a2', nome: 'Museu da Cidade', categoria: 'museu', descricao: 'Acervo sobre cultura local.', nota: 4.6, endereco: 'Rua das Artes, 45 - Centro', imagem: '/assets/img/museu.jpg', mapa: 'https://maps.google.com/?q=Museu da Cidade', geo: { lat: -22.2215, lng: -54.8051 } },
  { id: 'a3', nome: 'Parque das Aguas', categoria: 'parque', descricao: 'Trilhas leves e lago.', nota: 4.8, endereco: 'Av. Verde, 500 - Parque', imagem: '/assets/img/parque.jpg', mapa: 'https://maps.google.com/?q=Parque das Aguas', geo: { lat: -22.2305, lng: -54.812 } },
  { id: 'a4', nome: 'Rota Gastronomica', categoria: 'gastronomia', descricao: 'Sabores regionais.', nota: 4.5, endereco: 'Rua do Sabor, 200 - Centro', imagem: '/assets/img/gastronomia.jpg', mapa: 'https://maps.google.com/?q=Rota Gastronomica', geo: { lat: -22.225, lng: -54.81 } }
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
  btnTema.setAttribute('aria-pressed', temaSalvo === 'dark');
  btnTema.addEventListener('click', () => {
    const novo = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
    document.documentElement.dataset.theme = novo;
    localStorage.setItem('tema', novo);
    btnTema.setAttribute('aria-pressed', novo === 'dark');
  });
})();

anoAtual.textContent = new Date().getFullYear();

function render(atracoes) {
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
    const t = termo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    arr = arr.filter(a => [a.nome, a.descricao, a.endereco].join(' ')
      .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(t));
  }
  if (categoria) arr = arr.filter(a => a.categoria === categoria);
  if (ordenar === 'avaliacao') arr.sort((a,b)=> b.nota - a.nota);
  if (ordenar === 'distancia') arr.sort((a,b)=> a.geo.lat - b.geo.lat);
  render(arr);
}

buscaForm.addEventListener('submit', (e) => { e.preventDefault(); termo = buscaInput.value.trim(); compute(); history.replaceState({}, '', `?q=${encodeURIComponent(termo)}`) });
filtroCategoria.addEventListener('change', (e)=> { categoria = e.target.value; compute(); });
ordenarPor.addEventListener('change', (e)=> { ordenar = e.target.value; compute(); });

function observeFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('is-visible'); });
  }, { threshold: 0.1 });
  $$('.fade-in').forEach(el => obs.observe(el));
}

compute();
