export let projectCode = `
<div class="fs-2 justify-content-center">Selected Project - See mints below</div>
<div class="row">
  <div class="col-sm-10 mb-6 p-3 justify-content-center">
    <div class="row justify-content-center">
      <div class="col-sm-10 col-md-5 mt-4 p-3">
        <div class="card m-2">
          <img src=<%= project.img_url  %> class="card-img-top" alt="..." />
          <div class="title-box">
            <div class="card-title">
              <p class="h3 m-2">
                <strong>
                  <%=project.project_name  %>
                </strong>
              </p>
            </div>
          </div>
          <div class="card-footer">
            <button id="mint-button" class="buttons-mint buttons-light btn btn-outline-light">Mint</button>
            <div id="project-id" class="d-none"><%= project.id %></div>
          </div>
        </div>
      </div>
      <div class="col-10 col-md-6 mt-2 p-3 text-start">
        <p>
        <h3 class="topic">Project name: </h3><%=project.project_name  %></p>
        <p>
        <h3 class="topic">Project description: </h3><%=project.project_description  %></p>
        <div class="row">
          <div class="col-4">
            <h3 class="topic">Price: </h3><%= project.price_eth  %> ETH
          </div>
          <div class="col-4">
            <h3 class="topic">Quantity: </h3><%=project.quantity  %>
          </div>
          <div class="col-4">
            <h3 class="topic">Royalties: </h3><%=project.royalty_percent  %>
          </div>
        </div>
        <p>
        <h3 class="topic">Opening date: </h3><%=project.open_date_gmt  %></p>
        <p>
        <h3 class="topic">Status: </h3><span id="status">Active - </span><span id="mint-quant"><em>[connect
            wallet]</em></span><span> of
          <%=project.quantity  %> minted</span></h3>
        </p>
      </div>
    </div>
  </div>
</div>

<div class="text-center justify-content-center mt-2 mb-2">
  <h2>Mints from <%=project.project_name  %></h2>
  <p id="mint-message">Connect Metamask to see mints</p>
</div>
<div class="mb-5">
  <div class="row justify-content-center">
    <div id="token-views"
      class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3 text-center justify-content-center">
      <!-- the client side ejs will render these dynamically from the sript -->
    </div>
  </div>
</div>
`;
