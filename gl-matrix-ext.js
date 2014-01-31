var mat4x = {};
/**
 * Copies the translation component of the supplied matrix m into this matrix translation component.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @returns {mat4} out
 */
mat4x.copyPosition = function (out, a) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];

    return out;
};

mat4x.compose = function (out, p, q, s) {
    mat4.identity(out);

    mat4.scale(out, out, s);
    mat4.translate(out, out, p);


    return out;
};