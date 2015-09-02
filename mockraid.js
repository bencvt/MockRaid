var MockRaid = {
  meter: {
    dps: [],
    hps: [],
  },
  newGroup: function() {
    var td = $("<td />")
    $("<div />").addClass("header").text("Group " + ($("#grid td").length + 1)).appendTo(td);
    td.appendTo("#grid tr");
    return this;
  },
  add: function(name, cls, role, dps, hps) {
    if ($("#grid td:last .unit").length >= 5) {
      this.newGroup();
    }
    this.meter.dps.push({rate:dps, name:name, cls:cls, role:role});
    this.meter.hps.push({rate:hps, name:name, cls:cls, role:role});
    var unit = $("<div />").addClass("unit").addClass(cls);
    $("<img />").attr("src", "assets/" + role + ".png").error(function(){$(this).hide();}).addClass("roleIcon").appendTo(unit);
    $("<span />").text(name).appendTo(unit);
    unit.appendTo("#grid td:last");
    $("<div />").addClass("power").addClass(cls + "-" + role).appendTo("#grid td:last");
    return this;
  },
  loadMeter: function(which, cap) {
    cmp = function(a, b) {
      var d = b.rate - a.rate;
      if (d == 0) {
          return (a.name > b.name);
      }
      return d;
    };
    var width = $("#" + which + " .bars").width();
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
      var bar = $("<div />").addClass("bar").addClass(player.cls);
      $("<div />").addClass("rank").text((i + 1) + ".").appendTo(bar);
      $("<div />").addClass("name").text(player.name).appendTo(bar);
      $("<div />").addClass("amount").text(player.amount.toFixed(1) + "M (" + player.rate.toFixed(1) + " K, " + (100.0 * player.amount / total).toFixed(1) + "%)").appendTo(bar);
      bar.width(width * player.amount / best - 2);
      bar.appendTo("#" + which + " .bars");
    });
    return this;
  },
};
