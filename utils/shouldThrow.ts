async function ShouldThrow(promise) {
try {
    await promise;
    assert(true);
}
catch (err) {
    return;
}
assert(false, "The contract did not throw.");

}

export default ShouldThrow;
