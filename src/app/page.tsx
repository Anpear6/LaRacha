'use client';

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Eye,
  EyeOff,
  Flame,
  LoaderCircle,
  LogOut,
  Mail,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import type { Usuario } from '../domain';
import {
  createLaRachaSupabaseClient,
  listarGruposUsuarioActual,
  obtenerUsuarioActual,
  type GrupoConMembresia,
} from '../infrastructure';

type Step = 'intro' | 'mode' | 'email' | 'name' | 'username' | 'birthdate' | 'password' | 'session';
type AuthMode = 'login' | 'signup';
type TransitionDirection = 'forward' | 'back';
type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export default function HomePage() {
  const supabase = useMemo(
    () => createLaRachaSupabaseClient({ url: supabaseUrl, anonKey: supabaseAnonKey }),
    [],
  );
  const [step, setStep] = useState<Step>('intro');
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('forward');
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [grupos, setGrupos] = useState<GrupoConMembresia[]>([]);

  useEffect(() => {
    async function cargarSesion() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setEmail(data.session.user.email ?? '');

        const perfilCompleto = await cargarDatosAutenticados();

        if (perfilCompleto) {
          setStep('session');
        } else {
          setMode('signup');
          setNeedsProfile(true);
          setStep('name');
        }
      }

      setLoading(false);
    }

    void cargarSesion();
  }, [supabase]);

  useEffect(() => {
    if (mode !== 'signup') {
      setUsernameStatus('idle');
      return;
    }

    const usernameLimpio = username.trim();

    if (!usernameLimpio) {
      setUsernameStatus('idle');
      return;
    }

    let cancelado = false;
    setUsernameStatus('checking');

    const timeoutId = window.setTimeout(() => {
      async function comprobarUsername() {
        const { data: usernameExiste, error: usernameError } = await supabase.rpc(
          'existe_usuario_por_username_mvp',
          { p_username: usernameLimpio },
        );

        if (cancelado) {
          return;
        }

        if (usernameError) {
          setUsernameStatus('error');
          return;
        }

        setUsernameStatus(usernameExiste ? 'taken' : 'available');
      }

      void comprobarUsername();
    }, 350);

    return () => {
      cancelado = true;
      window.clearTimeout(timeoutId);
    };
  }, [mode, supabase, username]);

  async function cargarDatosAutenticados(): Promise<boolean> {
    const usuarioActual = await obtenerUsuarioActual(supabase);

    if (!usuarioActual) {
      setUsuario(null);
      setGrupos([]);
      return false;
    }

    const gruposActuales = await listarGruposUsuarioActual(supabase);

    setUsuario(usuarioActual);
    setGrupos(gruposActuales);
    return true;
  }

  function comenzarLogin() {
    setMode('login');
    setNeedsProfile(false);
    setError('');
    irAPaso('email', 'forward');
  }

  function comenzarRegistro() {
    setMode('signup');
    setNeedsProfile(false);
    setError('');
    irAPaso('email', 'forward');
  }

  function irAPaso(nextStep: Step, direction: TransitionDirection) {
    setTransitionDirection(direction);
    setStep(nextStep);
  }

  async function avanzarDesdeEmail() {
    if (!email.trim()) {
      setError('Necesito un email para abrirte la puerta.');
      return;
    }

    if (mode === 'signup') {
      setSubmitting(true);
      const { data: emailExiste, error: emailError } = await supabase.rpc(
        'existe_usuario_por_email_mvp',
        { p_email: email.trim() },
      );
      setSubmitting(false);

      if (emailError) {
        setError('No he podido comprobar ese email. Prueba otra vez en un momento.');
        return;
      }

      if (emailExiste) {
        setError('Ese email ya tiene una cuenta. Prueba a entrar en vez de crear una nueva.');
        return;
      }
    }

    setError('');
    irAPaso(mode === 'login' ? 'password' : 'name', 'forward');
  }

  function avanzarDesdeNombre() {
    if (!nombre.trim()) {
      setError('Pon tu nombre para que La Racha sepa quien llega.');
      return;
    }

    setError('');
    irAPaso('username', 'forward');
  }

  function avanzarDesdeUsername() {
    if (!username.trim()) {
      setError('El nombre de usuario tambien cuenta como ritual de entrada.');
      return;
    }

    if (usernameStatus === 'checking') {
      setError('Estoy comprobando si ese usuario esta libre. Dame un segundo.');
      return;
    }

    if (usernameStatus === 'taken') {
      setError('Alto ahi. Ese ya esta cogido. Prueba con otro.');
      return;
    }

    if (usernameStatus === 'error') {
      setError('No he podido comprobar ese usuario. Prueba otra vez en un momento.');
      return;
    }

    setError('');
    irAPaso('birthdate', 'forward');
  }

  function avanzarDesdeFechaNacimiento() {
    if (!fechaNacimiento) {
      setError('Pon tu fecha de nacimiento para preparar bien tu perfil.');
      return;
    }

    const fechaSeleccionada = new Date(`${fechaNacimiento}T00:00:00`);
    const hoy = new Date();

    if (Number.isNaN(fechaSeleccionada.getTime()) || fechaSeleccionada > hoy) {
      setError('Esa fecha no me cuadra. Revisa que no sea futura.');
      return;
    }

    setError('');

    if (needsProfile) {
      void crearPerfilParaSesionActual();
      return;
    }

    irAPaso('password', 'forward');
  }

  async function enviarAuth() {
    if (!password.trim()) {
      setError('Falta la contraseña.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (loginError) {
          throw loginError;
        }

        const perfilCompleto = await cargarDatosAutenticados();

        if (!perfilCompleto) {
          setMode('signup');
          setNeedsProfile(true);
          setPassword('');
          irAPaso('name', 'forward');
          return;
        }
      } else {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signupError) {
          throw signupError;
        }

        if (!data.user) {
          throw new Error('Cuenta creada, pero Supabase no devolvio usuario.');
        }

        if (data.user.identities?.length === 0) {
          throw new Error('email_already_registered');
        }

        if (!data.session) {
          setError('Te hemos enviado un email para confirmar la cuenta antes de entrar.');
          return;
        }

        await crearPerfil(data.user.id, data.user.email ?? email.trim());
      }

      setStep('session');
    } catch (authError) {
      setError(crearMensajeErrorAuth(authError, mode));
    } finally {
      setSubmitting(false);
    }
  }

  async function crearPerfilParaSesionActual() {
    setSubmitting(true);
    setError('');

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error('Necesitas iniciar sesion antes de completar el perfil.');
      }

      await crearPerfil(user.id, user.email ?? email.trim());
      setNeedsProfile(false);
      setStep('session');
    } catch (profileError) {
      setError(crearMensajeErrorAuth(profileError, 'signup'));
    } finally {
      setSubmitting(false);
    }
  }

  async function crearPerfil(userId: string, userEmail: string) {
    const { error: profileError } = await supabase.from('usuarios').insert({
      id: userId,
      nombre: nombre.trim(),
      username: username.trim(),
      email: userEmail,
      fecha_nacimiento: fechaNacimiento,
    });

    if (profileError) {
      throw profileError;
    }

    await cargarDatosAutenticados();
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUsuario(null);
    setGrupos([]);
    setPassword('');
    setStep('intro');
  }

  function volver() {
    setError('');

    if (step === 'password') {
      irAPaso(mode === 'login' ? 'email' : 'birthdate', 'back');
      return;
    }

    if (step === 'birthdate') {
      irAPaso('username', 'back');
      return;
    }

    if (step === 'username') {
      irAPaso('name', 'back');
      return;
    }

    if (step === 'name') {
      irAPaso('email', 'back');
      return;
    }

    if (step === 'email') {
      irAPaso('mode', 'back');
    }
  }

  if (loading) {
    return (
      <main className="auth-shell">
        <section className="auth-card auth-card-centered">
          <img className="mini-mark" src="/brand/logo-rayo-transparente.png" alt="" />
          <p>Preparando La Racha...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={step === 'intro' ? 'intro-shell' : 'auth-shell'}>
      {step !== 'session' ? (
        <>
          {step === 'intro' && (
            <IntroVideoScreen onEnded={() => setStep('mode')} />
          )}
          {step !== 'intro' && (
            <section className={`auth-card ${step === 'mode' ? 'auth-card-choice' : 'auth-card-step'}`}>
              {step === 'mode' && (
                <AuthChoicePanel onLogin={comenzarLogin} onSignup={comenzarRegistro} />
              )}
              {step === 'email' && (
                <StepPanel
                  key={step}
                  title="Tu email"
                  subtitle={mode === 'login' ? 'Vamos a buscar tu racha.' : 'Primero, por donde te avisamos.'}
                  error={error}
                  onBack={volver}
                  onSubmit={avanzarDesdeEmail}
                  submitLabel={submitting ? 'Comprobando...' : 'Continuar'}
                  disabled={submitting}
                  progress={calcularProgreso(step, mode)}
                  direction={transitionDirection}
                >
                  <OvalInput
                    icon={<Mail size={20} />}
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoFocus
                  />
                </StepPanel>
              )}
              {step === 'name' && (
                <StepPanel
                  key={step}
                  title="Tu nombre"
                  subtitle="El de persona real, no el de leyenda."
                  error={error}
                  onBack={volver}
                  onSubmit={avanzarDesdeNombre}
                  submitLabel="Continuar"
                  progress={calcularProgreso(step, mode)}
                  direction={transitionDirection}
                >
                  <OvalInput
                    icon={<UserRound size={20} />}
                    label="Nombre"
                    value={nombre}
                    onChange={setNombre}
                    autoFocus
                  />
                </StepPanel>
              )}
              {step === 'username' && (
                <StepPanel
                  key={step}
                  title="Tu usuario"
                  subtitle="El nombre visible fuera de tus grupos."
                  error={error}
                  onBack={volver}
                  onSubmit={avanzarDesdeUsername}
                  submitLabel="Continuar"
                  progress={calcularProgreso(step, mode)}
                  direction={transitionDirection}
                >
                  <OvalInput
                    icon={<Sparkles size={20} />}
                    action={<UsernameStatusIcon status={usernameStatus} />}
                    label="Nombre de usuario"
                    value={username}
                    onChange={setUsername}
                    autoFocus
                  />
                  <UsernameFeedback status={usernameStatus} />
                </StepPanel>
              )}
              {step === 'birthdate' && (
                <StepPanel
                  key={step}
                  title="Tu cumple"
                  subtitle="Para futuras funciones por edad, sin complicarlo ahora."
                  error={error}
                  onBack={volver}
                  onSubmit={avanzarDesdeFechaNacimiento}
                  submitLabel={submitting ? 'Guardando...' : needsProfile ? 'Crear perfil' : 'Continuar'}
                  disabled={submitting}
                  progress={calcularProgreso(step, mode)}
                  direction={transitionDirection}
                >
                  <OvalInput
                    icon={<CalendarDays size={20} />}
                    label="Fecha de nacimiento"
                    type="date"
                    value={fechaNacimiento}
                    onChange={setFechaNacimiento}
                    autoFocus
                  />
                </StepPanel>
              )}
              {step === 'password' && (
                <StepPanel
                  key={step}
                  title="Contraseña"
                  subtitle={mode === 'login' ? 'La llave secreta del grupo.' : 'Último paso y entramos.'}
                  error={error}
                  onBack={volver}
                  onSubmit={enviarAuth}
                  submitLabel={submitting ? 'Entrando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
                  disabled={submitting}
                  progress={calcularProgreso(step, mode)}
                  direction={transitionDirection}
                >
                  <OvalInput
                    icon={<Flame size={20} />}
                    action={
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    }
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    autoFocus
                  />
                </StepPanel>
              )}
            </section>
          )}
        </>
      ) : (
        <SessionScreen usuario={usuario} grupos={grupos} onLogout={cerrarSesion} />
      )}
    </main>
  );
}

function UsernameStatusIcon({ status }: { status: UsernameStatus }) {
  if (status === 'checking') {
    return <LoaderCircle className="username-status-icon username-status-icon-checking" size={20} />;
  }

  if (status === 'available') {
    return <Check className="username-status-icon username-status-icon-ok" size={21} />;
  }

  if (status === 'taken' || status === 'error') {
    return <X className="username-status-icon username-status-icon-error" size={21} />;
  }

  return null;
}

function UsernameFeedback({ status }: { status: UsernameStatus }) {
  if (status === 'available') {
    return <p className="availability-message availability-message-ok">Libre. Ese usuario promete.</p>;
  }

  if (status === 'taken') {
    return <p className="availability-message availability-message-error">Alto ahi. Ese ya esta cogido. Prueba con otro.</p>;
  }

  if (status === 'checking') {
    return <p className="availability-message availability-message-checking">Comprobando disponibilidad...</p>;
  }

  if (status === 'error') {
    return <p className="availability-message availability-message-error">No puedo comprobarlo ahora mismo.</p>;
  }

  return null;
}

function BrandHeader() {
  return (
    <header className="brand-header">
      <img className="brand-logo" src="/brand/logo-completo-transparente.png" alt="La Racha" />
      <p>Menos scrolling y mas verse las caras.</p>
    </header>
  );
}

function IntroVideoScreen({ onEnded }: { onEnded: () => void }) {
  return (
    <video
      className="intro-video-full"
      src="/brand/intro.mp4"
      autoPlay
      muted
      playsInline
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = 0.86;
      }}
      onEnded={onEnded}
    />
  );
}

function AuthChoicePanel({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <>
      <BrandHeader />
      <ModeScreen onLogin={onLogin} onSignup={onSignup} />
    </>
  );
}

function ModeScreen({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <div className="mode-screen">
      <button className="primary-button" type="button" onClick={onLogin}>
        Entrar
      </button>
      <button className="secondary-button" type="button" onClick={onSignup}>
        Crear cuenta
      </button>
    </div>
  );
}

function calcularProgreso(step: Step, mode: AuthMode): number {
  const loginSteps: Step[] = ['email', 'password'];
  const signupSteps: Step[] = ['email', 'name', 'username', 'birthdate', 'password'];
  const steps = mode === 'login' ? loginSteps : signupSteps;
  const stepIndex = steps.indexOf(step);

  if (stepIndex === -1) {
    return 0;
  }

  return ((stepIndex + 1) / steps.length) * 100;
}

function crearMensajeErrorAuth(error: unknown, mode: AuthMode): string {
  if (!(error instanceof Error)) {
    return 'Algo no ha salido bien. Prueba otra vez.';
  }

  const message = error.message.toLowerCase();

  if (mode === 'signup' && message.includes('duplicate key')) {
    if (message.includes('usuarios_email')) {
      return 'Ese email ya tiene una cuenta. Prueba a entrar en vez de crear una nueva.';
    }

    if (message.includes('usuarios_username')) {
      return 'Ese nombre de usuario ya está cogido. Prueba con otro.';
    }

    return 'Ya existe una cuenta con alguno de esos datos. Prueba a entrar o cambia el usuario.';
  }

  if (mode === 'signup' && message.includes('already registered')) {
    return 'Ese email ya tiene una cuenta. Prueba a entrar en vez de crear una nueva.';
  }

  if (mode === 'signup' && message.includes('email_already_registered')) {
    return 'Ese email ya tiene una cuenta. Prueba a entrar en vez de crear una nueva.';
  }

  if (mode === 'login' && (message.includes('invalid login') || message.includes('invalid credentials'))) {
    return 'Email o contraseña incorrectos. Revisa los datos y vuelve a intentarlo.';
  }

  return error.message;
}

function StepPanel({
  title,
  subtitle,
  children,
  error,
  onBack,
  onSubmit,
  submitLabel,
  disabled = false,
  progress,
  direction,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  error: string;
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
  submitLabel: string;
  disabled?: boolean;
  progress: number;
  direction: TransitionDirection;
}) {
  return (
    <form
      className="step-panel"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <div className="step-fixed-controls">
        <button className="back-button" type="button" onClick={onBack} aria-label="Volver">
          <ArrowLeft size={22} />
        </button>
        <div className="progress-track" aria-hidden="true">
          <span className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={`step-motion step-motion-${direction}`}>
        <div className="step-copy">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
        {error ? <p className="error-message">{error}</p> : null}
        <button className="primary-button" type="submit" disabled={disabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function OvalInput({
  icon,
  action,
  label,
  type = 'text',
  value,
  onChange,
  autoFocus = false,
}: {
  icon: ReactNode;
  action?: ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <label className="oval-input">
      <span>{icon}</span>
      <input
        autoFocus={autoFocus}
        placeholder={label}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {action}
    </label>
  );
}

function SessionScreen({
  usuario,
  grupos,
  onLogout,
}: {
  usuario: Usuario | null;
  grupos: GrupoConMembresia[];
  onLogout: () => void;
}) {
  return (
    <section className="session-shell">
      <header className="session-header">
        <img className="session-logo" src="/brand/logo-rayo-transparente.png" alt="" />
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut size={18} />
          Salir
        </button>
      </header>
      <div className="session-copy">
        <p>Sesión iniciada</p>
        <h1>{usuario ? `Hola, ${usuario.nombre}` : 'Hola'}</h1>
      </div>
      <div className="group-list">
        {grupos.map(({ grupo, membresia }) => (
          <article className="group-item" key={grupo.id}>
            <div>
              <h2>{grupo.nombre}</h2>
              <p>{membresia.apodo} · {membresia.rol}</p>
            </div>
            <span>{grupo.frecuenciaRacha}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
