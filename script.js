import React, { useState, useEffect } from 'react';
import * as pbi from 'powerbi-client';

const Report = () => {
  const [report, setReport] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const embedConfiguration = {
      type: 'report',
      id: '<REPORT_ID>', // Substitua com seu Report ID real
      embedUrl: '<REPORT_EMBED_URL>', // Substitua com a URL de Embed real
      accessToken: '<ACCESS_TOKEN>', // Substitua com o Access Token real
      tokenType: pbi.models.TokenType.Embed,
      permissions: pbi.models.Permissions.All,
      settings: {
        panes: {
          filters: {
            visible: true
          },
          pageNavigation: {
            visible: true
          }
        },
        bars: {
          statusBar: {
            visible: true
          }
        }
      }
    };

    const powerbi = new pbi.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );

    const reportContainer = document.getElementById('reportContainer');
    const embeddedReport = powerbi.embed(reportContainer, embedConfiguration);

    embeddedReport.on('loaded', () => {
      console.log("Relatório carregado");
      setReport(embeddedReport);
    });

    embeddedReport.on('rendered', () => {
      console.log("Relatório renderizado");
    });

    embeddedReport.on('error', error => {
      console.error("Erro no Power BI:", error.detail);
    });

    return () => powerbi.reset(reportContainer); // Limpa o embed ao desmontar
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const applyFilter = async () => {
    if (report) {
      const filter = {
        $schema: "http://powerbi.com/product/schema#basic",
        target: {
          table: "Consumo_detonação", // Use sua tabela e coluna real
          column: "Produto"
        },
        operator: "In",
        values: [inputValue]
      };

      try {
        await report.setFilters([filter]);
        console.log("Filtro aplicado com sucesso.");
      } catch (error) {
        console.error("Erro ao aplicar filtro:", error);
      }
    }
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Digite o produto para filtrar" />
      <button onClick={applyFilter}>Aplicar Filtro</button>
      <div id="reportContainer" style={{ height: 600, width: '100%' }}></div>
    </div>
  );
};

export default Report;
