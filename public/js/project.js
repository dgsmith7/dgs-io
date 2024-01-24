export let projectCode = `<div class="row text-center justify-content-center">
<div class="fs-2">Selected Project - See mints below</div>
  <div class="col-10 mb-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-4 mt-4">
        <div class="card m-2">
          <img src=<%= project.img_url  %> class="card-img-top" alt="..." />
          <div>
            <div class="card-title">
              <p class="h3 m-2">
                <strong>
                  <%=project.project_name  %>
                </strong>
              </p>
            </div>
          </div>
          <div class="card-footer">
            <a id="mint-button" class="btn btn-primary">Mint</a>
            <div id="project-id" class="d-none"><%= project.id %></div>
          </div>
        </div>
      </div>
      <div class="col-10 col-md-6 mt-2 text-start">
        <p>
        <h3 class="topic">Project name: </h3><%=project.project_name  %></p>
        <p>
        <h3 class="topic">Project description: </h3><%=project.project_description  %></p>
        <div class="row">
          <div class="col-5">
            <h3 class="topic">Price: </h3><%= project.price_eth  %>
          </div>
          <div class="col-5">
            <h3 class="topic">Quantity: </h3><%=project.quantity  %>
          </div>
        </div>
        <p>
        <h3 class="topic">Opening date: </h3><%=project.open_date_gmt  %></p>
        <p>
        <h3 class="topic">Royalties: </h3>Royalties set to <%=project.royalty_percent  %>% of secondary sales
        </p>
        <p>
        <h3 class="topic">Status: </h3><span id="status">Active - </span><span id="mint-quant"><em>[connect
            wallet]</em></span><span> of
          <%=project.quantity  %> minted</span></h3>
        </p>
      </div>
    </div>
  </div>
</div>
</section>

<section class="justify-content-center">
<div class="text-center justify-content-center mt-2 mb-2">
  <h2>Mints from this project</h2>
  <p id="mint-message"></p>
</div>
<div class="mb-5">
  <div class="row justify-content-center">
    <div id="token-views"
      class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3 text-center justify-content-center">
      <!-- the client side ejs will render these dynamically from the sript -->
    </div>
  </div>
</div>
</section>
`;
