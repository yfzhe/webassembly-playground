(module
  ;; tail-recursive version of fibonacci
  (func $fib_tail_helper (param i32 i64 i64) (result i64)
    (if (result i64)
        (i32.eqz (local.get 0))
        (then (local.get 1))
        (else
          (return_call $fib_tail_helper
                       (i32.sub (local.get 0) (i32.const 1))
                       (local.get 2)
                       (i64.add (local.get 1) (local.get 2))))))

  (func $fib_tail (export "fib") (param i32) (result i64)
    (call $fib_tail_helper (local.get 0)
                           (i64.const 0)
                           (i64.const 1))))
