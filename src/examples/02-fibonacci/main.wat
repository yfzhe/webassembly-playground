(module
  (func $fib_naive (export "fib") (param i32) (result i32)
    (block
      (block
        (block
          (local.get 0)
          (br_table 0 1 2))
        (i32.const 1)
        (return))

      (i32.const 1)
      (return))

    (local.get 0)
    (i32.const 1)
    i32.sub
    call $fib_naive

    (local.get 0)
    (i32.const 2)
    i32.sub
    call $fib_naive

    i32.add))
