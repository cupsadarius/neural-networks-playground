class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray(arr) {
    if (arr[0] instanceof Array) {
      let matrix = new Matrix(arr.length, arr[0].length);
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
          matrix.data[i][j] = arr[i][j];
        }
      }
      return matrix;
    } else {
      return new Matrix(arr.length, 1).map((e, i) => arr[i]);
    }
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(lamda) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = lamda(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, lamda) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => lamda(matrix.data[i][j], i, j));
  }

  static normalize(matrix) {
    const colSum = Matrix.transpose(matrix).data.map((col) => col.reduce((acc, elem) => acc + elem, 0));
    return matrix.copy()
      .map((e, i, j) => {
        return e / colSum[j];
      });
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}