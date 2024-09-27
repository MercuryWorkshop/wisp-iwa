mkdir pkg
RUSTFLAGS='-C target-feature=+atomics,+bulk-memory' cargo build --target wasm32-unknown-unknown -Z build-std=panic_abort,std --release "$@"
wasm-bindgen --target web --out-dir pkg/ target/wasm32-unknown-unknown/release/wisp_iwa_rust.wasm
AUTOGENERATED_SOURCE=$(<"pkg/wisp_iwa_rust.js")
AUTOGENERATED_SOURCE=${AUTOGENERATED_SOURCE//getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2)/getObject(arg0).send(new Uint8Array(getArrayU8FromWasm0(arg1, arg2)).buffer}
echo "$AUTOGENERATED_SOURCE" > "pkg/wisp_iwa_rust.js"
