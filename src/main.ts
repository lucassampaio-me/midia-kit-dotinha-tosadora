if (new URLSearchParams(location.search).get('estudo') === 'logo') {
  void import('./studies/logo').then(module => module.mount());
} else {
  void import('./site');
}
