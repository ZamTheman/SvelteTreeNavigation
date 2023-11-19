


<script lang="ts">
  import AdaNode from "./AdaNode.svelte";
  import { root } from "./MockData";

  let data = root;
  let searchText: string | null = null;

  const handleSelect = (event: CustomEvent<SelectedEventDetail>) => {
    handleEntitySelected(event.detail.id);
  } 

  const handleEntitySelected = (id: string) => {
    selectEntityById(id);
  }

  const selectEntityById = (id: string): void => {
    root.customers = root.customers.map(customer => ({
      ...customer,
      isSelected: customer.id == id,
      sites: customer.sites.map(site => ({
        ...site,
        isSelected: site.id === id,
        buildings: site.buildings.map(building => ({
          ...building,
          isSelected: building.id === id
        })),
        endpoints: site.endpoints.map(endpoint => ({
          ...endpoint,
          isSelected: endpoint.id === id
        })),
      }))
    }));
  };

  $: filteredContent = searchText ? filterCustomers(data.customers, searchText) : data.customers;

  function filterCustomers(customers: CustomerNode[], searchText: string): CustomerNode[] {
    return customers.filter(customer => {
      const customerMatches = customer.name.toLowerCase().includes(searchText.toLowerCase());
      const sites = customer.sites.map(site => {
        const siteMatches = site.name.toLowerCase().includes(searchText.toLowerCase());
        const buildings = site.buildings.filter(building => 
          building.name.toLowerCase().includes(searchText.toLowerCase())
        );
        const endpoints = site.endpoints.filter(endpoint => 
          endpoint.name.toLowerCase().includes(searchText.toLowerCase())
        );

        return {
          ...site,
          buildings,
          endpoints,
          isSelected: siteMatches || buildings.length > 0 || endpoints.length > 0
        };
      });

      return {
        ...customer,
        sites,
        isSelected: customerMatches || sites.some(site => site.isSelected)
      };
    });
  }

</script>

<div>
  <input class="m-1 bg-gray-200 rounded-lg p-2" placeholder="Filter" type="text"/>
  <AdaNode
    type="root"
    text="Entitites"
    bind:isExpanded={root.isExpanded}
    indentLevel={1}
    />
    {#if data.isExpanded}
      {#each data.customers as customer}
      <AdaNode
          type="customer"
          id={customer.id}
          text={customer.name}
          indentLevel={2}
          on:selected={handleSelect}
          bind:isExpanded={customer.isExpanded}
          bind:isActive={customer.isSelected}
          />
        {#if customer.isExpanded}
          <AdaNode
            type="header"
            text="Sites"
            indentLevel={3}
            />
          {#each customer.sites as site}
            <AdaNode
              type="site"
              id={site.id}
              text={site.name}
              on:selected={handleSelect}
              bind:isExpanded={site.isExpanded}
              bind:isActive={site.isSelected}
              indentLevel={3}
              />
              {#if site.isExpanded}
                <AdaNode
                type="header"
                text="Buildings"
                indentLevel={4}
                />
                {#each site.buildings as building}
                  <AdaNode
                  type="building"
                  id={building.id}
                  text={building.name}
                  on:selected={handleSelect}
                  bind:isExpanded={building.isExpanded}
                  bind:isActive={building.isSelected}
                  indentLevel={4}
                  />
                {/each}
                <AdaNode
                type="header"
                text="Endpoints"
                indentLevel={4}
                />
              {/if}
          {/each}
        {/if}
      {/each}
    {/if}
</div>