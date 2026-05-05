import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Cookie,
  Edit3,
  Heart,
  Lock,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Trash2,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import OAuthButtons from './componentes/autenticacion/BotonesOAuth';
import Footer from './componentes/estructura/PiePagina';
import { getSiteStats } from './servicios/servicioSitio';
import { publicacionesDemo, temasVivos } from './datos/contenidoInicio';
import CommunityPage from './paginas/PaginaComunidad';
import CreatorsPage from './paginas/PaginaCreadores';
import DraftsPage from './paginas/PaginaBorradores';
import FeedbackPage from './paginas/PaginaOpinion';
import LegalPage from './paginas/PaginaLegal';
import NotificationsPage from './paginas/PaginaNotificaciones';
import OAuthCallbackPage from './paginas/PaginaCallbackOAuth';
import OnboardingPage from './paginas/PaginaInicioGuiado';
import PricingPage from './paginas/PaginaPlanes';
import ProductPage from './paginas/PaginaProducto';
import SavedPostsPage from './paginas/PaginaGuardados';
import SettingsPage from './paginas/PaginaAjustes';
import SupportPage from './paginas/PaginaSoporte';
import TrendsPage from './paginas/PaginaTendencias';
import { api, getErrorMessage, setAuthToken } from './servicios/clienteApi';
import { getCurrentUser, login, register } from './servicios/servicioAutenticacion';
import { traducciones } from './idiomas/traducciones';
import { assetUrl, plainText } from './utilidades/formateadores';

const AuthContext = createContext(null);
const PreferenciasContext = createContext(null);

function PreferenciasProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('pixara_tema') || 'claro');
  const [idioma, setIdioma] = useState(() => localStorage.getItem('pixara_idioma') || 'es');

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('pixara_tema', tema);
  }, [tema]);

  useEffect(() => {
    document.documentElement.lang = idioma;
    localStorage.setItem('pixara_idioma', idioma);
  }, [idioma]);

  const t = useCallback((clave) => traducciones[idioma]?.[clave] || traducciones.es[clave] || clave, [idioma]);
  const alternarTema = useCallback(() => setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro')), []);
  const alternarIdioma = useCallback(() => setIdioma((actual) => (actual === 'es' ? 'en' : 'es')), []);

  const value = useMemo(
    () => ({ tema, idioma, t, alternarTema, alternarIdioma }),
    [tema, idioma, t, alternarTema, alternarIdioma]
  );

  return <PreferenciasContext.Provider value={value}>{children}</PreferenciasContext.Provider>;
}

function usePreferencias() {
  return useContext(PreferenciasContext);
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pixara_token') || '');
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem('pixara_usuario');
    return raw ? JSON.parse(raw) : null;
  });
  const [cargandoUsuario, setCargandoUsuario] = useState(false);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const guardarSesion = useCallback((datos) => {
    setToken(datos.token);
    setUsuario(datos.usuario);
    localStorage.setItem('pixara_token', datos.token);
    localStorage.setItem('pixara_usuario', JSON.stringify(datos.usuario));
  }, []);

  const cerrarSesion = useCallback(() => {
    setToken('');
    setUsuario(null);
    localStorage.removeItem('pixara_token');
    localStorage.removeItem('pixara_usuario');
  }, []);

  const refrescarUsuario = useCallback(async () => {
    if (!token) return;
    setCargandoUsuario(true);
    try {
      const { data } = await getCurrentUser();
      setUsuario(data.datos);
      localStorage.setItem('pixara_usuario', JSON.stringify(data.datos));
    } catch {
      cerrarSesion();
    } finally {
      setCargandoUsuario(false);
    }
  }, [cerrarSesion, token]);

  useEffect(() => {
    refrescarUsuario();
  }, [refrescarUsuario]);

  const value = useMemo(
    () => ({ token, usuario, cargandoUsuario, guardarSesion, cerrarSesion, refrescarUsuario }),
    [token, usuario, cargandoUsuario, guardarSesion, cerrarSesion, refrescarUsuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function normalizarEtiquetasTexto(valor) {
  return String(valor || '')
    .split(/[\s,]+/)
    .map((etiqueta) => etiqueta.trim().replace(/^#+/, '').toLowerCase())
    .filter(Boolean)
    .filter((etiqueta, index, lista) => lista.indexOf(etiqueta) === index)
    .slice(0, 10);
}

function obtenerInteresesLocales() {
  try {
    return JSON.parse(localStorage.getItem('pixara_intereses') || '[]');
  } catch {
    return [];
  }
}

function guardarInteresesLocales(valor) {
  const nuevos = normalizarEtiquetasTexto(valor);
  if (!nuevos.length) return;
  const actuales = obtenerInteresesLocales();
  const mezclados = [...new Set([...nuevos, ...actuales])].slice(0, 12);
  localStorage.setItem('pixara_intereses', JSON.stringify(mezclados));
}

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const { usuario, token, cerrarSesion } = useAuth();
  const { tema, idioma, t, alternarTema, alternarIdioma } = usePreferencias();
  const navigate = useNavigate();
  const [cookiesAceptadas, setCookiesAceptadas] = useState(() => localStorage.getItem('pixara_cookies') === 'aceptadas');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const logout = () => {
    cerrarSesion();
    toast.success(t('sesionCerrada'));
    setMenuAbierto(false);
    navigate('/');
  };

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">PIXARA</Link>
        <nav className={`nav-actions ${menuAbierto ? 'is-open' : ''}`}>
          <Link onClick={cerrarMenu} to="/">{t('inicio')}</Link>
          <Link onClick={cerrarMenu} to="/explorar">{t('historias')}</Link>
          <Link onClick={cerrarMenu} to="/producto">{t('producto')}</Link>
          <Link onClick={cerrarMenu} to="/comunidad">{t('comunidad')}</Link>
          <Link onClick={cerrarMenu} to="/tendencias">{t('tendencias')}</Link>
          <Link onClick={cerrarMenu} to="/creadores">{t('creadores')}</Link>
          {token && <Link onClick={cerrarMenu} to="/escribir">{t('escribir')}</Link>}
          {token && usuario ? (
            <>
              <Link onClick={cerrarMenu} to="/guardados">{t('guardados')}</Link>
              <Link onClick={cerrarMenu} to="/notificaciones">{t('avisos')}</Link>
              <Link onClick={cerrarMenu} to={`/perfil/${usuario.nombreUsuario}`}>{t('perfil')}</Link>
              <button className="text-button" onClick={logout} title={t('salir')}>{t('salir')}</button>
            </>
          ) : (
            <>
              <Link onClick={cerrarMenu} to="/login">{t('entrar')}</Link>
              <Link onClick={cerrarMenu} to="/registro">{t('registrarse')}</Link>
            </>
          )}
        </nav>
        <div className="top-controls">
          <button className="top-icon-button" type="button" onClick={alternarTema} aria-label={tema === 'oscuro' ? t('temaClaro') : t('temaOscuro')} title={tema === 'oscuro' ? t('temaClaro') : t('temaOscuro')}>
            {tema === 'oscuro' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="language-button" type="button" onClick={alternarIdioma} aria-label={t('cambiarIdioma')} title={t('cambiarIdioma')}>
            <span>{idioma === 'es' ? 'ES' : 'GB'}</span>
            <span className={`flag-icon flag-${idioma === 'es' ? 'es' : 'gb'}`} aria-hidden="true" />
          </button>
          <Link className="top-search" to="/buscar" aria-label={t('buscar')} onClick={cerrarMenu}><Search size={22} /></Link>
          <button className="menu-button" type="button" onClick={() => setMenuAbierto((actual) => !actual)} aria-label={menuAbierto ? t('cerrarMenu') : t('abrirMenu')}>
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Feed tipo="global" />} />
          <Route path="/explorar" element={<Feed tipo="explorar" />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/login" element={<AuthForm modo="login" />} />
          <Route path="/registro" element={<AuthForm modo="registro" />} />
          <Route path="/escribir" element={<PrivateRoute><EditorPublicacion /></PrivateRoute>} />
          <Route path="/publicacion/:id" element={<DetallePublicacion />} />
          <Route path="/perfil/:nombreUsuario" element={<Perfil />} />
          <Route path="/producto" element={<ProductPage />} />
          <Route path="/comunidad" element={<CommunityPage />} />
          <Route path="/tendencias" element={<TrendsPage />} />
          <Route path="/creadores" element={<CreatorsPage />} />
          <Route path="/planes" element={<PricingPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/guardados" element={<PrivateRoute><SavedPostsPage /></PrivateRoute>} />
          <Route path="/borradores" element={<PrivateRoute><DraftsPage /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/ajustes" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/soporte" element={<SupportPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/privacidad" element={<LegalPage tipo="privacidad" />} />
          <Route path="/cookies" element={<LegalPage tipo="cookies" />} />
          <Route path="/terminos" element={<LegalPage tipo="terminos" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer textos={{ descripcion: t('footerTexto'), soporte: t('soporte'), privacidad: t('privacidad'), cookies: t('cookies'), terminos: t('terminos') }} />
      {!cookiesAceptadas && <CookieBanner onAccept={() => {
        localStorage.setItem('pixara_cookies', 'aceptadas');
        setCookiesAceptadas(true);
      }} />}
    </div>
  );
}

function CookieBanner({ onAccept }) {
  const { t } = usePreferencias();
  return (
    <aside className="cookie-banner">
      <div className="cookie-icon"><Cookie size={22} /></div>
      <div>
        <strong>{t('cookiesTitulo')}</strong>
        <p>{t('cookiesTexto')}</p>
      </div>
      <button type="button" onClick={onAccept}>{t('aceptar')}</button>
    </aside>
  );
}

function App() {
  return (
    <PreferenciasProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </PreferenciasProvider>
  );
}

function Feed({ tipo }) {
  const { token } = useAuth();
  const { t } = usePreferencias();
  const [publicaciones, setPublicaciones] = useState([]);
  const [estado, setEstado] = useState('cargando');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroHistorias, setFiltroHistorias] = useState('recientes');

  const cargar = useCallback(async (paginaActual = 1) => {
    setEstado('cargando');
    if (tipo === 'explorar' && filtroHistorias === 'siguiendo' && !token) {
      setPublicaciones([]);
      setPagina(1);
      setTotalPaginas(1);
      setEstado('listo');
      return;
    }

    try {
      let endpoint = token && tipo === 'global' ? '/publicaciones/feed' : '/publicaciones';
      const params = { pagina: paginaActual, limite: 9 };

      if (tipo === 'explorar') {
        if (filtroHistorias === 'para-ti') {
          endpoint = '/publicaciones/feed';
          params.intereses = obtenerInteresesLocales().join(',');
        } else if (filtroHistorias === 'siguiendo') {
          endpoint = '/publicaciones/siguiendo';
        } else if (filtroHistorias === 'populares') {
          endpoint = '/publicaciones/explorar';
        }
      }

      const { data } = await api.get(endpoint, { params });
      setPublicaciones(data.datos || []);
      setPagina(data.pagina || 1);
      setTotalPaginas(data.totalPaginas || 1);
      setEstado('listo');
    } catch (error) {
      setPublicaciones(filtroHistorias === 'siguiendo' ? [] : publicacionesDemo);
      setPagina(1);
      setTotalPaginas(1);
      setEstado('listo');
      toast.error(getErrorMessage(error));
    }
  }, [filtroHistorias, tipo, token]);

  useEffect(() => {
    cargar(1);
  }, [cargar]);

  if (tipo === 'explorar') {
    return (
      <section className="stories-view">
        <div className="stories-header">
          <span className="section-label">{t('historias')}</span>
          <h1>{t('historiasHeroTitulo')}</h1>
          <p>{t('historiasTexto')}</p>
        </div>
        <div className="stories-filters">
          <button className={filtroHistorias === 'recientes' ? 'active' : ''} onClick={() => setFiltroHistorias('recientes')}>{t('recientes')}</button>
          <button className={filtroHistorias === 'para-ti' ? 'active' : ''} onClick={() => setFiltroHistorias('para-ti')}>{t('paraTi')}</button>
          <button className={filtroHistorias === 'siguiendo' ? 'active' : ''} onClick={() => setFiltroHistorias('siguiendo')}>{t('siguiendo')}</button>
          <button className={filtroHistorias === 'populares' ? 'active' : ''} onClick={() => setFiltroHistorias('populares')}>{t('populares')}</button>
        </div>
        <StoriesList publicaciones={publicaciones} estado={estado} filtro={filtroHistorias} onRefresh={() => cargar(pagina)} />
        {totalPaginas > 1 && (
          <div className="pagination">
            <button disabled={pagina <= 1} onClick={() => cargar(pagina - 1)}>{t('anterior')}</button>
            <span>{pagina} / {totalPaginas}</span>
            <button disabled={pagina >= totalPaginas} onClick={() => cargar(pagina + 1)}>{t('siguiente')}</button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="view home-view">
      <PixaraHomeHero token={token} />
      <TopicRail />
      <div className="section-heading">
        <h1>{t('historiasRecientes')}</h1>
        <Link className="hero-secondary" to="/explorar">{t('verHistorias')}<ArrowRight size={18} /></Link>
      </div>
      <PostGrid publicaciones={publicaciones} estado={estado} onRefresh={() => cargar(pagina)} />
      <HomeNarrative />
      <HomeSignals />

      {totalPaginas > 1 && (
        <div className="pagination">
          <button disabled={pagina <= 1} onClick={() => cargar(pagina - 1)}>{t('anterior')}</button>
          <span>{pagina} / {totalPaginas}</span>
          <button disabled={pagina >= totalPaginas} onClick={() => cargar(pagina + 1)}>{t('siguiente')}</button>
        </div>
      )}
    </section>
  );
}

function PixaraHomeHero({ token }) {
  const { t } = usePreferencias();
  return (
    <section className="pixara-hero">
      <div className="pixara-hero-copy">
        <span className="carousel-kicker">{t('heroEtiqueta')}</span>
        <h1>{t('heroTitulo')}</h1>
        <p>{t('heroTexto')}</p>
        <div className="hero-actions">
          <Link className="carousel-cta" to={token ? '/escribir' : '/registro'}>
            {token ? t('escribirAhora') : t('crearCuenta')} <ArrowRight size={20} />
          </Link>
          <Link className="hero-secondary" to="/explorar">{t('explorarHistorias')}</Link>
        </div>
      </div>
      <div className="pixara-hero-visual" aria-hidden="true">
        <div className="pixara-window">
          <div className="pixara-window-bar">
            <i />
            <i />
            <i />
          </div>
          <div className="pixara-window-body">
            <div className="pixara-feed-line large" />
            <div className="pixara-feed-line" />
            <div className="pixara-feed-card">
              <span>{t('heroVisualEtiqueta')}</span>
              <strong>{t('heroVisualTitulo')}</strong>
              <p>{t('heroVisualTexto')}</p>
            </div>
            <div className="pixara-feed-line short" />
          </div>
        </div>
        <div className="pixara-profile-card">
          <span>PX</span>
          <strong>Pixara</strong>
          <small>{t('lecturaSocial')}</small>
        </div>
      </div>
    </section>
  );
}

function HomeNarrative() {
  const { t } = usePreferencias();
  const secciones = [
    {
      titulo: t('homeLeeTitulo'),
      texto: t('homeLeeTexto')
    },
    {
      titulo: t('homeEscribeTitulo'),
      texto: t('homeEscribeTexto')
    },
    {
      titulo: t('homeDescubreTitulo'),
      texto: t('homeDescubreTexto')
    }
  ];

  return (
    <section className="home-narrative">
      <span className="section-label">{t('comoFunciona')}</span>
      {secciones.map((item, index) => (
        <article key={item.titulo}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h2>{item.titulo}</h2>
            <p>{item.texto}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function HomeSignals() {
  const { t } = usePreferencias();
  const [stats, setStats] = useState({ usuarios: 0, publicaciones: 0, comentarios: 0, guardados: 0 });

  useEffect(() => {
    getSiteStats()
      .then(({ data }) => setStats(data.datos || { usuarios: 0, publicaciones: 0, comentarios: 0, guardados: 0 }))
      .catch(() => {});
  }, []);

  const items = [
    [t('usuarios'), stats.usuarios],
    [t('publicaciones'), stats.publicaciones],
    [t('comentarios'), stats.comentarios],
    [t('guardadosContador'), stats.guardados]
  ];

  return (
    <section className="home-signals">
      <div>
        <span className="section-label">{t('senalesVivas')}</span>
        <h2>{t('senalesTitulo')}</h2>
      </div>
      <div className="home-signal-list">
        {items.map(([label, value]) => (
          <p key={label}><strong>{value}</strong><span>{label}</span></p>
        ))}
      </div>
    </section>
  );
}

function StoriesList({ publicaciones, estado, filtro, onRefresh }) {
  const { t } = usePreferencias();
  if (estado === 'cargando') return <div className="status">{t('cargandoHistorias')}</div>;
  if (estado === 'error') return <button className="retry" onClick={onRefresh}>Reintentar</button>;
  if (!publicaciones.length && filtro === 'siguiendo') return <EmptyState title={t('siguiendoVacioTitulo')} text={t('siguiendoVacioTexto')} />;

  return (
    <div className="stories-list">
      {(publicaciones.length ? publicaciones : publicacionesDemo).map((publicacion) => (
        <StoryRow key={publicacion.id} publicacion={publicacion} />
      ))}
    </div>
  );
}

function StoryRow({ publicacion }) {
  const imagen = Array.isArray(publicacion.imagenes) ? publicacion.imagenes[0] : null;
  const contenido = plainText(publicacion.contenido || '');

  return (
    <article className="story-row">
      <Avatar usuario={publicacion.autor} />
      <div className="story-row-main">
        <Link className="author-row" to={`/perfil/${publicacion.autor?.nombreUsuario || ''}`}>
          <strong>{publicacion.autor?.nombreUsuario || 'Autor'}</strong>
          <span>@{publicacion.autor?.nombreUsuario || 'autor'}</span>
        </Link>
        {publicacion.demo ? <h2>{publicacion.titulo}</h2> : <Link to={`/publicacion/${publicacion.id}`}><h2>{publicacion.titulo}</h2></Link>}
        <p>{contenido.slice(0, 230)}{contenido.length > 230 ? '...' : ''}</p>
        {imagen && <img className="story-row-image" src={assetUrl(imagen)} alt="" />}
        <div className="story-row-meta">
          <div className="tag-row">
            {(publicacion.etiquetas || []).slice(0, 4).map((etiqueta) => <span key={etiqueta.id}>#{etiqueta.nombre}</span>)}
          </div>
          <div className="metric-row">
            <span><Heart size={16} />{publicacion.totalMeGustas || publicacion.meGustas?.length || 0}</span>
            <span><MessageCircle size={16} />{publicacion.totalComentarios || publicacion.comentarios?.length || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function TopicRail() {
  return (
    <div className="topic-rail">
      {temasVivos.map((tema, index) => (
        <Link to={`/buscar?q=${encodeURIComponent(tema)}`} className={`topic-chip chip-${index % 4}`} key={tema}>
          #{tema}
        </Link>
      ))}
    </div>
  );
}

function DiscoverSection() {
  return (
    <section className="discover-section">
      <h2>Descubrir</h2>
      <div className="discover-grid">
        <Link to="/explorar"><span>Pixara Introducción</span></Link>
        <Link to="/explorar"><span>Autores destacados</span></Link>
        <Link to="/explorar"><span>Historias con afinidad</span></Link>
        <Link to="/explorar"><span>Privacidad y comunidad</span></Link>
      </div>
    </section>
  );
}

function FeaturedCarousel({ publicaciones }) {
  const { t } = usePreferencias();
  const items = publicaciones.slice(0, 5);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActual((indice) => (indice + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const publicacion = items[actual];
  const imagen = Array.isArray(publicacion.imagenes) ? publicacion.imagenes[0] : null;
  const anterior = () => setActual((indice) => (indice - 1 + items.length) % items.length);
  const siguiente = () => setActual((indice) => (indice + 1) % items.length);

  return (
    <section className="featured-carousel">
      <button className="carousel-arrow carousel-prev" type="button" onClick={anterior} aria-label={t('anterior')}><ChevronLeft size={26} /></button>
      <button className="carousel-arrow carousel-next" type="button" onClick={siguiente} aria-label={t('siguiente')}><ChevronRight size={26} /></button>
      <div className="carousel-copy">
        <span className="carousel-kicker">Pixara Discovery</span>
        <h2>{publicacion.titulo}</h2>
        <Link className="carousel-cta" to={publicacion.demo ? '/registro' : `/publicacion/${publicacion.id}`}>
          {publicacion.demo ? t('empezarAhora') : t('leerAhora')} <ArrowRight size={20} />
        </Link>
        <p>{plainText(publicacion.contenido).slice(0, 180)}{plainText(publicacion.contenido).length > 180 ? '...' : ''}</p>
        <div className="tag-row">
          {(publicacion.etiquetas || []).slice(0, 3).map((etiqueta) => <span key={etiqueta.id}>#{etiqueta.nombre}</span>)}
        </div>
      </div>
      <div className="carousel-visual">
        {imagen ? <img src={assetUrl(imagen)} alt="" /> : <ProductMockup publicacion={publicacion} />}
      </div>
      <div className="carousel-dots">
        {items.map((item, index) => (
          <button
            type="button"
            className={index === actual ? 'active' : ''}
            onClick={() => setActual(index)}
            aria-label={`Ir al destacado ${index + 1}`}
            key={item.id}
          />
        ))}
      </div>
    </section>
  );
}

function ProductMockup({ publicacion }) {
  const etiquetas = (publicacion.etiquetas || []).slice(0, 4);
  const autor = publicacion.autor?.nombreUsuario || 'autor';

  return (
    <article className="publication-visual">
      <div className="publication-visual-header">
        <Avatar usuario={publicacion.autor} />
        <div>
          <strong>@{autor}</strong>
          <span>Publicación destacada</span>
        </div>
      </div>
      <h3>{publicacion.titulo}</h3>
      <p>{plainText(publicacion.contenido).slice(0, 260)}{plainText(publicacion.contenido).length > 260 ? '...' : ''}</p>
      {etiquetas.length > 0 && (
        <div className="tag-row">
          {etiquetas.map((etiqueta) => <span key={etiqueta.id || etiqueta.nombre}>#{etiqueta.nombre}</span>)}
        </div>
      )}
      <div className="publication-visual-footer">
        <span><Heart size={16} />{publicacion.totalMeGustas || 0}</span>
        <span><MessageCircle size={16} />{publicacion.totalComentarios || 0}</span>
      </div>
    </article>
  );
}

function PulseStrip() {
  return (
    <section className="pulse-strip">
      <div>
        <TrendingUp size={22} />
        <strong>Ahora mismo</strong>
        <span>Descubre historias como si estuvieras eligiendo contenido que encaja contigo.</span>
      </div>
      <div>
        <Flame size={22} />
        <strong>Afinidad real</strong>
        <span>Temas, autores y guardados se ordenan para que no pierdas tiempo.</span>
      </div>
      <div>
        <Sparkles size={22} />
        <strong>Más social</strong>
        <span>Comentarios, perfiles y seguimiento para convertir lecturas en conexiones.</span>
      </div>
    </section>
  );
}

function PostGrid({ publicaciones, estado, onRefresh }) {
    if (estado === 'cargando') return <div className="status">Cargando publicaciones...</div>;
  if (estado === 'error') return <button className="retry" onClick={onRefresh}>Reintentar</button>;
  return (
    <div className="post-grid">
      {(publicaciones.length ? publicaciones : publicacionesDemo).map((publicacion) => <PostCard key={publicacion.id} publicacion={publicacion} />)}
    </div>
  );
}

function PostCard({ publicacion }) {
  const imagen = Array.isArray(publicacion.imagenes) ? publicacion.imagenes[0] : null;
  return (
    <article className={`post-card ${publicacion.demo ? 'demo-card' : ''}`}>
      {imagen && <img className="post-image" src={assetUrl(imagen)} alt="" />}
      {!imagen && <div className="post-poster"><span>{(publicacion.etiquetas?.[0]?.nombre || 'Px').slice(0, 2).toUpperCase()}</span></div>}
      <div className="post-body">
        <Link className="author-row" to={`/perfil/${publicacion.autor?.nombreUsuario || ''}`}>
          <Avatar usuario={publicacion.autor} />
          <span>{publicacion.autor?.nombreUsuario || 'Autor'}</span>
        </Link>
        {publicacion.demo ? <span className="post-title">{publicacion.titulo}</span> : <Link to={`/publicacion/${publicacion.id}`} className="post-title">{publicacion.titulo}</Link>}
        <p>{plainText(publicacion.contenido).slice(0, 170)}{plainText(publicacion.contenido).length > 170 ? '...' : ''}</p>
        <div className="tag-row">
          {(publicacion.etiquetas || []).slice(0, 4).map((etiqueta) => <span key={etiqueta.id}>#{etiqueta.nombre}</span>)}
        </div>
        <div className="metric-row">
          <span><Heart size={16} />{publicacion.totalMeGustas || publicacion.meGustas?.length || 0}</span>
          <span><MessageCircle size={16} />{publicacion.totalComentarios || publicacion.comentarios?.length || 0}</span>
        </div>
      </div>
    </article>
  );
}

function Buscar() {
  const { t } = usePreferencias();
  const [params, setParams] = useSearchParams();
  const [termino, setTermino] = useState(params.get('q') || '');
  const [publicaciones, setPublicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estado, setEstado] = useState('idle');

  const buscar = useCallback(async (valor) => {
    if (!valor.trim()) return;
    setEstado('cargando');
    guardarInteresesLocales(valor);
    setParams({ q: valor });
    try {
      const [posts, users] = await Promise.all([
        api.get('/publicaciones/buscar', { params: { termino: valor } }),
        api.get('/usuarios/buscar', { params: { termino: valor } }),
      ]);
      setPublicaciones(posts.data.datos || []);
      setUsuarios(users.data.datos || []);
      setEstado('listo');
    } catch (error) {
      setEstado('error');
      toast.error(getErrorMessage(error));
    }
  }, [setParams]);

  useEffect(() => {
    const q = params.get('q');
    if (q) buscar(q);
  }, [buscar, params]);

  return (
    <section className="view">
      <div className="section-heading">
        <h1>{t('buscarTitulo')}</h1>
        <form className="search-form" onSubmit={(event) => { event.preventDefault(); buscar(termino); }}>
          <Search size={20} />
          <input value={termino} onChange={(event) => setTermino(event.target.value)} placeholder={t('buscarPlaceholder')} />
          <button>{t('buscar')}</button>
        </form>
      </div>
      {estado === 'idle' && <EmptyState title={t('buscarVacioTitulo')} text={t('buscarVacioTexto')} />}
      {estado === 'cargando' && <div className="status">{t('buscando')}</div>}
      {estado === 'listo' && (
        <>
          <UserList usuarios={usuarios} />
          <PostGrid publicaciones={publicaciones} estado="listo" />
        </>
      )}
    </section>
  );
}

function AuthForm({ modo }) {
  const { t } = usePreferencias();
  const esLogin = modo === 'login';
  const { guardarSesion, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombreUsuario: '', correo: '', identificador: '', contrasena: '' });
  const [enviando, setEnviando] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      const payload = esLogin
        ? { identificador: form.identificador, contrasena: form.contrasena }
        : { nombreUsuario: form.nombreUsuario, correo: form.correo, contrasena: form.contrasena };
      const { data } = await (esLogin ? login(payload) : register(payload));
      guardarSesion(data.datos);
      toast.success(esLogin ? t('bienvenido') : t('cuentaCreada'));
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-view">
      <form className="form-panel auth-panel" onSubmit={submit}>
        <h1>{esLogin ? t('entrar') : t('crearCuenta')}</h1>
        {!esLogin && (
          <>
            <label>{t('usuario')}<input value={form.nombreUsuario} onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })} required minLength={3} /></label>
            <label>{t('correo')}<input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required /></label>
          </>
        )}
        {esLogin && <label>{t('usuarioOCorreo')}<input value={form.identificador} onChange={(e) => setForm({ ...form, identificador: e.target.value })} required /></label>}
        <label>{t('contrasena')}<input type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} required minLength={6} /></label>
        <button disabled={enviando}>{enviando ? t('enviando') : esLogin ? t('entrar') : t('registrarme')}</button>
        <OAuthButtons />
        <p>{esLogin ? t('noTienesCuenta') : t('yaTienesCuenta')} <Link to={esLogin ? '/registro' : '/login'}>{esLogin ? t('registrate') : t('entrar')}</Link></p>
      </form>
    </section>
  );
}

function EditorPublicacion() {
  const { t } = usePreferencias();
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo: '', contenido: '', etiquetas: '', esBorrador: false });
  const [imagenes, setImagenes] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const etiquetasPreview = normalizarEtiquetasTexto(form.etiquetas).slice(0, 6);
  const imagenPreview = Array.from(imagenes || [])[0];
  const imagenPreviewUrl = imagenPreview ? URL.createObjectURL(imagenPreview) : '';

  const submit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    const data = new FormData();
    data.append('titulo', form.titulo);
    data.append('contenido', form.contenido);
    data.append('etiquetas', normalizarEtiquetasTexto(form.etiquetas).join(','));
    data.append('esBorrador', String(form.esBorrador));
    Array.from(imagenes).forEach((file) => data.append('imagenes', file));
    try {
      const response = await api.post('/publicaciones', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(form.esBorrador ? t('borradorGuardado') : t('publicacionCreada'));
      navigate(`/publicacion/${response.data.datos.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="writer-studio">
      <form className="writer-editor" onSubmit={submit}>
        <div className="writer-toolbar">
          <div>
            <span className="section-label">{t('escribir')}</span>
            <h1>{form.titulo || t('tituloHistoria')}</h1>
          </div>
          <div className="writer-actions">
            <label className="check-row"><input type="checkbox" checked={form.esBorrador} onChange={(e) => setForm({ ...form, esBorrador: e.target.checked })} />{t('guardarBorrador')}</label>
            <button disabled={enviando}>{enviando ? t('guardando') : t('publicar')}</button>
          </div>
        </div>

        <div className="writer-fields">
          <input className="title-input" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder={t('tituloHistoria')} required minLength={5} />
          <textarea className="writer-textarea" value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} placeholder={t('escribeMarkdown')} required minLength={20} />
        </div>

        <div className="editor-grid writer-meta">
          <label>{t('etiquetas')}<input value={form.etiquetas} onChange={(e) => setForm({ ...form, etiquetas: e.target.value })} placeholder="#react #viajes #ideas" /></label>
          <SelectorArchivo
            etiqueta={t('imagenes')}
            textoBoton={t('seleccionarImagenes')}
            archivos={imagenes}
            multiple
            onChange={setImagenes}
          />
        </div>
      </form>

      <aside className="writer-preview">
        <div className="preview-shell">
          <span className="section-label">{t('vistaPrevia')}</span>
          {imagenPreviewUrl && <img className="preview-cover" src={imagenPreviewUrl} alt="" />}
          <h2>{form.titulo || t('tituloHistoria')}</h2>
          {etiquetasPreview.length > 0 && (
            <div className="tag-row">
              {etiquetasPreview.map((etiqueta) => <span key={etiqueta}>#{etiqueta}</span>)}
            </div>
          )}
          <div className="markdown-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.contenido || t('contenidoPreview')}</ReactMarkdown>
          </div>
        </div>
      </aside>
    </section>
  );
}

function DetallePublicacion() {
  const { id } = useParams();
  const { token, usuario } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [estado, setEstado] = useState('cargando');
  const [comentario, setComentario] = useState('');

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      const { data } = await api.get(`/publicaciones/${id}`);
      setPost(data.datos);
      setEstado('listo');
    } catch (error) {
      setEstado('error');
      toast.error(getErrorMessage(error));
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const toggleLike = async () => {
    try {
      const { data } = await api.post(`/publicaciones/${id}/me-gusta`);
      setPost((actual) => ({
        ...actual,
        leGusta: data.leGusta,
        totalMeGustas: Math.max(0, (actual.totalMeGustas || 0) + (data.leGusta ? 1 : -1)),
      }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const guardar = async () => {
    try {
      const { data } = await api.post(`/publicaciones/${id}/guardar`);
      toast.success(data.mensaje);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const comentar = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/comentarios', { publicacionId: id, contenido: comentario });
      setPost((actual) => ({
        ...actual,
        comentarios: [data.datos, ...(actual.comentarios || [])],
        totalComentarios: (actual.totalComentarios || 0) + 1,
      }));
      setComentario('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const eliminarPublicacion = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(`/publicaciones/${id}`);
      toast.success('Publicación eliminada');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const hacerPrivada = async () => {
    try {
      await api.put(`/publicaciones/${id}`, { esBorrador: true });
      toast.success('Publicación marcada como privada');
      navigate('/borradores');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (estado === 'cargando') return <div className="status">Cargando publicación...</div>;
  if (estado === 'error' || !post) return <EmptyState title="No se pudo cargar" text="La publicación no está disponible." />;

  const imagenes = Array.isArray(post.imagenes) ? post.imagenes : [];
  const esAutor = usuario?.id === post.usuarioId;

  return (
    <article className="article-view">
      <header className="article-header">
        <Link className="author-row" to={`/perfil/${post.autor?.nombreUsuario}`}>
          <Avatar usuario={post.autor} />
          <span>{post.autor?.nombreUsuario}</span>
        </Link>
        <h1>{post.titulo}</h1>
        {(post.etiquetas || []).length > 0 && <div className="tag-row">{post.etiquetas.map((tag) => <span key={tag.id}>#{tag.nombre}</span>)}</div>}
        {imagenes.length > 0 && <img className="article-cover" src={assetUrl(imagenes[0])} alt="" />}
      </header>

      <div className="article-layout">
        <section className="article-main">
          <div className="article-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contenido}</ReactMarkdown></div>
          <div className="article-actions">
            <button className={post.leGusta ? 'active' : ''} disabled={!token} onClick={toggleLike}><Heart size={18} />{post.totalMeGustas || 0}</button>
            <button disabled={!token} onClick={guardar}><Bookmark size={18} />Guardar</button>
            {esAutor && <Link to="/escribir"><Edit3 size={18} />Editar</Link>}
            {esAutor && <button type="button" onClick={hacerPrivada}><Lock size={18} />Poner privada</button>}
            {esAutor && <button type="button" className="danger-button" onClick={eliminarPublicacion}><Trash2 size={18} />Eliminar</button>}
          </div>
        </section>

        <section className="comments">
          <h2>Comentarios</h2>
          {token ? (
            <form onSubmit={comentar} className="comment-form">
              <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Suma una idea..." required />
              <button>Comentar</button>
            </form>
          ) : (
            <p><Link to="/login">Entra</Link> para comentar.</p>
          )}
          {(post.comentarios || []).map((item) => (
            <div className="comment" key={item.id}>
              <Avatar usuario={item.usuario} />
              <div><strong>{item.usuario?.nombreUsuario}</strong><p>{item.contenido}</p></div>
            </div>
          ))}
        </section>
      </div>
    </article>
  );
}

function Perfil() {
  const { nombreUsuario } = useParams();
  const { usuario, token, refrescarUsuario } = useAuth();
  const { t } = usePreferencias();
  const [perfil, setPerfil] = useState(null);
  const [estado, setEstado] = useState('cargando');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombreUsuario: '', correo: '', biografia: '' });
  const [avatarArchivo, setAvatarArchivo] = useState(null);
  const [redActiva, setRedActiva] = useState('seguidores');
  const [redSocial, setRedSocial] = useState({ seguidores: [], siguiendo: [] });
  const [estadoRed, setEstadoRed] = useState('cargando');

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      const { data } = await api.get(`/usuarios/${nombreUsuario}`);
      setPerfil(data.datos);
      setForm({
        nombreUsuario: data.datos.nombreUsuario || '',
        correo: data.datos.correo || '',
        biografia: data.datos.biografia || '',
      });
      setEstado('listo');
    } catch (error) {
      setEstado('error');
      toast.error(getErrorMessage(error));
    }
  }, [nombreUsuario]);

  const cargarRedSocial = useCallback(async (usuarioId) => {
    if (!usuarioId) return;
    setEstadoRed('cargando');
    try {
      const [seguidores, siguiendo] = await Promise.all([
        api.get(`/seguidores/${usuarioId}/seguidores`),
        api.get(`/seguidores/${usuarioId}/siguiendo`),
      ]);
      setRedSocial({
        seguidores: seguidores.data.datos || [],
        siguiendo: siguiendo.data.datos || [],
      });
      setEstadoRed('listo');
    } catch (error) {
      setEstadoRed('error');
      toast.error(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (perfil?.id) cargarRedSocial(perfil.id);
  }, [cargarRedSocial, perfil?.id]);

  const toggleFollow = async () => {
    try {
      if (perfil.sigueAlUsuario) await api.delete(`/seguidores/dejar-seguir/${perfil.id}`);
      else await api.post(`/seguidores/seguir/${perfil.id}`);
      setPerfil((actual) => ({
        ...actual,
        sigueAlUsuario: !actual.sigueAlUsuario,
        totalSeguidores: Math.max(0, (actual.totalSeguidores || 0) + (actual.sigueAlUsuario ? -1 : 1)),
      }));
      await cargarRedSocial(perfil.id);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const guardarPerfil = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('nombreUsuario', form.nombreUsuario);
    data.append('correo', form.correo);
    data.append('biografia', form.biografia);
    if (avatarArchivo) data.append('avatar', avatarArchivo);
    try {
      await api.put('/usuarios/perfil', data);
      toast.success('Perfil actualizado');
      setAvatarArchivo(null);
      await refrescarUsuario();
      setEditando(false);
      cargar();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const eliminarAvatar = async () => {
    try {
      await api.delete('/usuarios/perfil/avatar');
      toast.success('Foto de perfil eliminada');
      setAvatarArchivo(null);
      await refrescarUsuario();
      await cargar();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (estado === 'cargando') return <div className="status">Cargando perfil...</div>;
  if (estado === 'error' || !perfil) return <EmptyState title="Perfil no encontrado" text="Ese usuario no existe o no está disponible." />;

  return (
    <section className="profile-view">
      <div className="profile-header">
        <Avatar usuario={perfil} grande />
        <div>
          <h1>@{perfil.nombreUsuario}</h1>
          <p>{perfil.biografia || 'Sin biografía todavía.'}</p>
          <div className="metric-row">
            <span>{perfil.totalSeguidores || 0} seguidores</span>
            <span>{perfil.totalSiguiendo || 0} siguiendo</span>
            <span>{perfil.totalPublicaciones || 0} publicaciones</span>
          </div>
        </div>
        {token && !perfil.esPerfilPropio && <button onClick={toggleFollow}><UserPlus size={18} />{perfil.sigueAlUsuario ? 'Siguiendo' : 'Seguir'}</button>}
        {perfil.esPerfilPropio && <button onClick={() => setEditando(!editando)}><Edit3 size={18} />Editar</button>}
      </div>
      {editando && usuario?.id === perfil.id && (
        <form className="form-panel inline" onSubmit={guardarPerfil}>
          <label>Usuario<input value={form.nombreUsuario} onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })} /></label>
          <label>Correo<input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} /></label>
          <SelectorArchivo
            etiqueta="Foto de perfil"
            textoBoton={t('seleccionarFoto')}
            archivos={avatarArchivo ? [avatarArchivo] : []}
            onChange={(archivos) => setAvatarArchivo(archivos?.[0] || null)}
          />
          {avatarArchivo && <img className="avatar-preview" src={URL.createObjectURL(avatarArchivo)} alt="Vista previa del avatar" />}
          <label>Biografía<textarea value={form.biografia} onChange={(e) => setForm({ ...form, biografia: e.target.value })} /></label>
          <div className="form-actions">
            <button>Guardar cambios</button>
            {perfil.avatar && <button type="button" className="danger-button" onClick={eliminarAvatar}><Trash2 size={18} />Eliminar foto</button>}
          </div>
        </form>
      )}
      <section className="profile-network">
        <div className="profile-network-header">
          <div>
            <span className="section-label">Red social</span>
            <h2>Personas conectadas</h2>
          </div>
          <div className="profile-network-tabs">
            <button type="button" className={redActiva === 'seguidores' ? 'active' : ''} onClick={() => setRedActiva('seguidores')}>
              Seguidores <span>{perfil.totalSeguidores || 0}</span>
            </button>
            <button type="button" className={redActiva === 'siguiendo' ? 'active' : ''} onClick={() => setRedActiva('siguiendo')}>
              Siguiendo <span>{perfil.totalSiguiendo || 0}</span>
            </button>
          </div>
        </div>
        {estadoRed === 'cargando' && <div className="status compact">Cargando usuarios...</div>}
        {estadoRed === 'error' && <button className="retry" onClick={() => cargarRedSocial(perfil.id)}>Reintentar</button>}
        {estadoRed === 'listo' && (
          <UserList
            usuarios={redSocial[redActiva]}
            emptyText={redActiva === 'seguidores' ? 'Todavía no tiene seguidores.' : 'Todavía no sigue a nadie.'}
          />
        )}
      </section>
      <PostGrid publicaciones={perfil.publicaciones || []} estado="listo" />
    </section>
  );
}

function UserList({ usuarios, emptyText = '' }) {
  if (!usuarios.length) return emptyText ? <p className="empty-inline">{emptyText}</p> : null;
  return (
    <div className="user-list">
      {usuarios.map((item) => (
        <Link to={`/perfil/${item.nombreUsuario}`} className="user-result" key={item.id}>
          <Avatar usuario={item} />
          <div><strong>@{item.nombreUsuario}</strong><p>{item.biografia || 'Autor de Pixara'}</p></div>
        </Link>
      ))}
    </div>
  );
}

function Avatar({ usuario, grande = false }) {
  return <img className={grande ? 'avatar avatar-lg' : 'avatar'} src={assetUrl(usuario?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nombreUsuario || 'P')}`} alt="" />;
}

function SelectorArchivo({ etiqueta, textoBoton, archivos, multiple = false, onChange }) {
  const { t } = usePreferencias();
  const lista = Array.from(archivos || []);
  const resumen = lista.length === 0
    ? t('ningunArchivo')
    : lista.length === 1
      ? lista[0].name
      : `${lista.length} ${t('archivosSeleccionados')}`;

  return (
    <label className="file-field">
      <span>{etiqueta}</span>
      <span className="file-dropzone">
        <input
          className="file-input"
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(event) => onChange(multiple ? event.target.files : Array.from(event.target.files || []))}
        />
        <span className="file-icon"><Upload size={20} /></span>
        <span className="file-copy">
          <strong>{textoBoton}</strong>
          <small>{t('soltarImagenes')}</small>
        </span>
        <span className="file-status">{resumen}</span>
      </span>
    </label>
  );
}

function EmptyState({ title, text }) {
  return <div className="empty"><h2>{title}</h2><p>{text}</p></div>;
}

function NotFound() {
  const { t } = usePreferencias();
  return <EmptyState title={t('paginaNoEncontrada')} text={t('rutaNoExiste')} />;
}

export default App;

