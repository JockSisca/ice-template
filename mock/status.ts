function success(data: any = {}) {
  return {
    msg: 'success',
    code: 0,
    ...data,
  };
}
function error() {}
export { success };
