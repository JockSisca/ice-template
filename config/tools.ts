import fs from 'fs';
import { resolve, join } from 'path';

/**
 * 查询文件夹内所有文件
 * @param startPath 入口
 * @returns
 */
function findSync(startPath: string) {
  const result: string[] = [];
  function finder(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    files.forEach((val) => {
      const fPath = join(dirPath, val);
      const stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) {
        if (fPath.indexOf('.md') === -1) {
          result.push(fPath);
        }
      }
    });
  }
  finder(resolve(__dirname, startPath));
  return result;
}

export { findSync };
