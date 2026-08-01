export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // webpackIgnore tells Turbopack to skip static analysis of this import and
    // leave it as a plain runtime dynamic import. Without it, Turbopack tries to
    // trace gluon-ai/instrumentation → server.js → require(path.join(...)) and
    // throws "Cannot find module as expression is too dynamic".
    const { register: gluonRegister } = await import(
      /* webpackIgnore: true */ "gluon-ai/instrumentation"
    );
    await gluonRegister();
  }
}
