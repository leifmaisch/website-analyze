"use client"

import {
  buildCurlExample,
  buildFetchExample,
  buildPythonExample,
} from "@/lib/api-docs-content"
import { ApiCodeBlock } from "@/components/api-docs/api-code-block"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type ApiExamplesProps = {
  apiUrl: string
}

export function ApiExamples({ apiUrl }: ApiExamplesProps) {
  return (
    <Tabs defaultValue="curl">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="curl">cURL</TabsTrigger>
        <TabsTrigger value="fetch">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="curl">
        <ApiCodeBlock code={buildCurlExample(apiUrl)} language="cURL" />
      </TabsContent>
      <TabsContent value="fetch">
        <ApiCodeBlock code={buildFetchExample(apiUrl)} language="JavaScript" />
      </TabsContent>
      <TabsContent value="python">
        <ApiCodeBlock code={buildPythonExample(apiUrl)} language="Python" />
      </TabsContent>
    </Tabs>
  )
}
