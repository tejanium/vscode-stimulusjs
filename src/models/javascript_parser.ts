const { Parser } = require('acorn');
const stage3 = require('acorn-stage3');
const bfs = require('acorn-bfs');
import { Node } from 'acorn';

const ExtendedParser = Parser.extend(stage3);

export interface JsNode extends Node {
	key: {
		name: string
	},
  value: JsNode | string,
  elements: JsNode[]
}

export class JavascriptParser {
  readonly nodes: JsNode[];

  constructor(text: string) {
    const ast = ExtendedParser.parse(text, { sourceType: 'module', locations: true });

    this.nodes = <JsNode[]>bfs(ast);
  }

  getElements(node: JsNode): JsNode[] {
    return (<JsNode>node.value).elements;
  }

  getValue(node: JsNode): string {
    return <string>node.value;
  }
}
