var MockRaid = {
  topID: 0,
  create: function() {
    this.topID = this.topID + 1;
    return this.createWithExistingDivs(
      "#MockRaid-" + this.topID + "-grid", 
      "#MockRaid-" + this.topID + "-dps",
      "#MockRaid-" + this.topID + "-hps");
  },
  createWithExistingDivs: function(grid, dps, hps) {
    var C = function(cls) {
      return "mockraid-" + cls;
    };

    var newGroup = function() {
      var td = $("<td />").addClass(C("group"));
      $("<div />").addClass(C("header")).text("Group " + (grid.find("td").length + 1)).appendTo(td);
      td.appendTo(grid.find("tr"));
    };

    if (!$(grid).length) {
      grid = $("<table id='" + grid.substring(1) + "' />").addClass(C("font"));
      $("<tr />").appendTo(grid);
      newGroup();
    }
    grid = $(grid);

    if (!$(dps).length) {
      dps = $("<div id='" + dps.substring(1) + "' />").addClass(C("font")).addClass(C("meter"));
      $("<div />").addClass(C("meter-header")).text("Overall damage done").appendTo(dps);
      $("<div />").addClass(C("meter-bars")).appendTo(dps);
    }
    dps = $(dps);

    if (!$(hps).length) {
      var hps = $("<div id='" + hps.substring(1) + "' />").addClass(C("font")).addClass(C("meter"));
      $("<div />").addClass(C("meter-header")).text("Overall healing done").appendTo(hps);
      $("<div />").addClass(C("meter-bars")).appendTo(hps);
    }
    hps = $(hps);

    return {
      div: {
        grid: grid,
        dps: dps,
        hps: hps,
      },
      meter: {
        dps: [],
        hps: [],
      },
      add: function(name, cls, role, dps, hps) {
        if (grid.find("td:last ." + C("unit")).length >= 5) {
          newGroup();
        }
        this.meter.dps.push({rate:dps, name:name, cls:cls, role:role});
        this.meter.hps.push({rate:hps, name:name, cls:cls, role:role});
        var unit = $("<div />").addClass(C("unit")).addClass(C(cls));
        $("<img />").attr("src", "assets/" + role + ".png").error(function(){$(this).hide();}).addClass(C("role-icon")).appendTo(unit);
        $("<span />").text(name).appendTo(unit);
        unit.appendTo(grid.find("td:last"));
        $("<div />").addClass(C("power")).addClass(C(cls + "-" + role)).appendTo(grid.find("td:last"));
        return this;
      },
      loadMeter: function(which, cap, width) {
        cmp = function(a, b) {
          var d = b.rate - a.rate;
          if (d == 0) {
              return (a.name > b.name);
          }
          return d;
        };
        width = width ? width : 328;
        var bars = (which == "dps" ? dps : hps).width(width).find("." + C("meter-bars"));
        this.meter[which].sort(cmp);
        var best = 0.0;
        var total = 0.0;
        $.each(this.meter[which], function(i, player) {
          player.amount = player.rate * 0.147;
          best = Math.max(best, player.amount);
          total += player.amount;
        });
        $.each(this.meter[which], function(i, player) {
          if (cap > 0 && i >= cap) {
            return;
          }
          var bar = $("<div />").addClass(C("meter-bar")).addClass(C(player.cls));
          $("<div />").addClass(C("meter-rank"))
            .text((i + 1) + ".")
            .appendTo(bar);
          $("<div />").addClass(C("meter-name"))
            .text(player.name)
            .appendTo(bar);
          $("<div />").addClass(C("meter-amount"))
            .text(player.amount.toFixed(1) + "M (" + player.rate.toFixed(1) + " K, " + (100.0 * player.amount / total).toFixed(1) + "%)")
            .css("margin-left", width - 204)
            .appendTo(bar);
          bar.width(width * player.amount / best - 2);
          bar.appendTo(bars);
        });
        return this;
      },
    };
  },
};
