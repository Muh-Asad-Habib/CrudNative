import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Compare, CompareItem } from "@/components/mdx/compare";
import { H2, H3, H4, MdxLink, MdxTable } from "@/components/mdx/elements";
import { Exercise } from "@/components/mdx/exercise";
import { FileTree } from "@/components/mdx/file-tree";
import { Flow } from "@/components/mdx/flow";
import { Quiz } from "@/components/mdx/quiz";
import { Solution } from "@/components/mdx/solution";
import { Step, Steps } from "@/components/mdx/steps";
import { Tab, Tabs } from "@/components/mdx/tabs";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/card";
import {
  CrudSimulator,
  FlexboxPlayground,
  HttpExplorer,
  ReactPlayground,
  SnackEmbed,
  SqlPlayground,
} from "@/components/labs/lazy";

const components: MDXComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
  a: MdxLink,
  pre: CodeBlock,
  table: MdxTable,
  Callout,
  Steps,
  Step,
  Tabs,
  Tab,
  FileTree,
  Flow,
  Exercise,
  Solution,
  Quiz,
  Compare,
  CompareItem,
  Badge,
  Kbd,
  CrudSimulator,
  HttpExplorer,
  SqlPlayground,
  FlexboxPlayground,
  ReactPlayground,
  SnackEmbed,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
