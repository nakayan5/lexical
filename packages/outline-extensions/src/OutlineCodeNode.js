/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {NodeKey, EditorThemeClasses, Selection} from 'outline';
import type {ParagraphNode} from 'outline-extensions/ParagraphNode';

import {BlockNode} from 'outline';
import {createParagraphNode} from 'outline-extensions/ParagraphNode';

export class CodeNode extends BlockNode {
  constructor(key?: NodeKey) {
    super(key);
    this.__type = 'code';
  }

  clone(): CodeNode {
    const clone = new CodeNode();
    clone.__children = [...this.__children];
    clone.__parent = this.__parent;
    clone.__flags = this.__flags;
    return clone;
  }

  // View

  createDOM(editorThemeClasses: EditorThemeClasses): HTMLElement {
    const element = document.createElement('code');
    const className = editorThemeClasses.code;
    if (className !== undefined) {
      element.className = className;
    }
    element.setAttribute('spellcheck', 'false');
    return element;
  }
  updateDOM(prevNode: CodeNode, dom: HTMLElement): boolean {
    return false;
  }

  // Mutation

  mergeWithPreviousSibling(): void {
    const prevBlock = this.getPreviousSibling();
    if (prevBlock === null) {
      const paragraph = createParagraphNode();
      const children = this.getChildren();
      children.forEach((child) => paragraph.append(child));
      this.replace(paragraph);
      return;
    }
    super.mergeWithPreviousSibling();
  }

  insertNewAfter(selection: Selection): null | ParagraphNode {
    const textContent = this.getTextContent();
    const anchorNode = selection.getAnchorNode();
    const anchorTextContentLength = anchorNode.getTextContent().length;
    const children = this.getChildren();
    const childrenLength = children.length;
    const lastChild = children[childrenLength - 1];
    const hasTwoEndingLineBreaks = textContent.slice(-2) === '\n\n';

    const offset = selection.anchorOffset;
    if (
      anchorNode !== lastChild ||
      offset !== anchorTextContentLength ||
      !hasTwoEndingLineBreaks
    ) {
      return null;
    }
    // Remove the dangling new lines
    if (hasTwoEndingLineBreaks) {
      // We offset by 1 extra because the last node should always be a text
      // node to ensure selection works as intended.
      const firstLinkBreak = children[childrenLength - 2];
      // Again offset because of wrapped text nodes
      const secondLinkBreak = children[childrenLength - 4];
      firstLinkBreak.remove();
      secondLinkBreak.remove();
    }
    const newBlock = createParagraphNode();
    this.insertAfter(newBlock);
    return newBlock;
  }

  canInsertTab(): true {
    return true;
  }
}

export function createCodeNode(): CodeNode {
  return new CodeNode();
}