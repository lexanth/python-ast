import { createVisitor, parse, walk } from './index';

describe('parser', () => {
  it('should parse the given Python code and return the AST', () => {
    const tree = parse(`
class TestClass:
    pass
`);

    expect(tree.children[1].getChild(0).getChild(0).getChild(1).text).toEqual('TestClass');
  });

  it('should handle super invocation with arguments', () => {
    const tree = parse(`
class B(A):
    def __init__(self):
        super().__init__(1)
`);

    const expressions = [];
    walk(
      {
        enterExpr: (c) => expressions.push(c.text),
      },
      tree,
    );

    expect(expressions).toContain('super().__init__(1)');
  });
});

describe('usage example', () => {
  it('works', () => {
    const countMethods = (source: string) =>
      createVisitor({
        visitFuncdef: () => 1,
        defaultResult: () => 0,
        aggregateResult: (a, b) => a + b,
      }).visit(parse(source));

    expect(
      countMethods(`
class A:
    a: int

    def b(self):
        pass
    
    def c(self):
        pass
class B:
    def z(self, i):
        pass
`),
    ).toEqual(3);
  });
});
