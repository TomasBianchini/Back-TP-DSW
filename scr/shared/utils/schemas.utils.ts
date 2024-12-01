function friendlyMessage(result: any): string {
  const friendlyMessage = result.error.errors.map((err: any) => {
    const field = err.path.join('.');
    const reason = err.message || `Invalid value for field "${field}"`;
    return `${field}: ${reason}`;
  });
  return friendlyMessage.join(', ');
}

export { friendlyMessage };
