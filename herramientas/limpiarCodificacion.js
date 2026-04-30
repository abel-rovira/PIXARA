const fs = require('fs');
const path = require('path');

const raiz = path.resolve(__dirname, '..');
const patronesRotos = [/Ã/, /Â/, /�/, /â/];

function caminar(directorio, salida = []) {
  for (const nombre of fs.readdirSync(directorio)) {
    const ruta = path.join(directorio, nombre);
    const estado = fs.statSync(ruta);
    if (estado.isDirectory() && nombre !== 'node_modules' && nombre !== 'dist') caminar(ruta, salida);
    else if (/\.(js|jsx|css|html|md)$/.test(nombre)) salida.push(ruta);
  }
  return salida;
}

const archivos = [
  ...caminar(path.join(raiz, 'frontend', 'src')),
  ...caminar(path.join(raiz, 'backend')).filter((archivo) => !archivo.includes(`${path.sep}node_modules${path.sep}`)),
  path.join(raiz, 'frontend', 'index.html'),
  path.join(raiz, 'AGENTS.md')
];

const encontrados = [];

for (const archivo of archivos) {
  const texto = fs.readFileSync(archivo, 'utf8');
  if (patronesRotos.some((patron) => patron.test(texto))) {
    encontrados.push(path.relative(raiz, archivo));
  }
}

if (encontrados.length > 0) {
  console.error('Se han encontrado posibles textos con codificacion rota:');
  encontrados.forEach((archivo) => console.error(`- ${archivo}`));
  process.exit(1);
}

console.log('Codificacion revisada: no se han encontrado textos rotos.');
